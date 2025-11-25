import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  useShiftsByGroupId,
  useShiftCompleteView,
} from "../../hooks/useShifts";
import type { ShiftDto } from "../../models/shift";
import { format } from "date-fns";
import { Calendar, Check, Clock, Users, X } from "lucide-react";
import {
  formatShiftDuration,
  VolunteerStatusToReadableFormat,
} from "../../utils";
import { cn } from "../../lib/utils";
import { VolunteerStatus } from "../../models";
import { Link } from "react-router-dom";

interface CalendarTabProps {
  groupId: string;
}

export function CalendarTab({ groupId }: CalendarTabProps) {
  const { data: shifts } = useShiftsByGroupId(groupId);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthDays = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);

  const today = format(new Date(), "yyyy-MM-dd");

  // map para lidar com escalas que ocorrem no mesmo dia:
  // {"2026-02-10" => Array(2)} -> array de escalas, 2 escalas para esse dia
  const shiftsByDayMap = useMemo(() => {
    // chave string, valores as escalas
    const map = new Map<string, ShiftDto[]>();

    // lidar com undefine
    (shifts || []).forEach((s) => {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);

      // Normaliza por dia: cobre escalas do mesmo dia
      const dayKey = format(start, "yyyy-MM-dd");
      const endKey = format(end, "yyyy-MM-dd");
      // Registra o dia inicial
      map.set(dayKey, [...(map.get(dayKey) || []), s]);

      if (endKey !== dayKey) {
        // Se terminar em outro dia, registra também para o dia final
        map.set(endKey, [...(map.get(endKey) || []), s]);
      }
    });
    return map;
  }, [shifts]);

  const selectedDayKey = selectedDay
    ? format(selectedDay, "yyyy-MM-dd")
    : undefined;
  const selectedDayShifts = selectedDayKey
    ? shiftsByDayMap.get(selectedDayKey) || []
    : [];

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Calendário</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentMonth(addMonthsSafe(currentMonth, -1))}
              >
                Mês anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentMonth(new Date())}
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentMonth(addMonthsSafe(currentMonth, 1))}
              >
                Próximo mês
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(currentMonth, "LLLL yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Escalas</Badge>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthDays.headers.map((h) => (
              <div
                key={h}
                className="text-xs font-medium text-muted-foreground text-center py-1"
              >
                {h}
              </div>
            ))}

            {monthDays.days.map((day) => {
              const key = format(day.date, "yyyy-MM-dd");
              const hasShifts = (shiftsByDayMap.get(key) || []).length > 0;

              const isOtherMonth = day.isOtherMonth;
              const isToday = key == today;

              return (
                <button
                  key={key + String(day.date.getDate())}
                  className={cn(
                    "rounded-md border p-2 text-left hover:bg-accent transition-colors min-h-10",
                    isOtherMonth ? "opacity-50" : "cursor-pointer",
                    isToday &&
                      "bg-primary text-primary-foreground border-primary hover:bg-primary/80"
                  )}
                  onClick={() => hasShifts && setSelectedDay(day.date)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {day.date.getDate()}
                    </span>
                    {hasShifts && (
                      <Badge className="ml-2">
                        {(shiftsByDayMap.get(key) || []).length}
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Escalas do Dia</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedDay && (
            <div className="text-sm text-muted-foreground">
              Selecione um dia com escalas para visualizar detalhes.
            </div>
          )}
          {selectedDay && selectedDayShifts.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Nenhuma escala neste dia.
            </div>
          )}
          {selectedDay && selectedDayShifts.length > 0 && (
            <div className="space-y-4">
              {selectedDayShifts.map((shift) => (
                <DayShiftDetails key={shift.id} shift={shift} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function addMonthsSafe(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function buildMonthGrid(current: Date) {
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const firstWeekDayIndex = firstDayOfMonth.getDay(); // 0=Domingo

  const days: { date: Date; isOtherMonth: boolean }[] = [];

  // Preenche dias do mês anterior
  for (let i = 0; i < firstWeekDayIndex; i++) {
    const d = new Date(year, month, 1 - (firstWeekDayIndex - i));

    days.push({ date: d, isOtherMonth: true });
  }

  // Dias do mês atual
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ date: new Date(year, month, d), isOtherMonth: false });
  }

  /*// Completa até múltiplo de 7 (5 ou 6 semanas)
  while (days.length % 7 !== 0) {
    // Enquanto o total de células (`days.length`) não for múltiplo de 7 (ou seja, a última
    // semana está incompleta), adiciona dias do próximo mês para completar a última linha.
    const last = days[days.length - 1].date;
    // Pega a última data já adicionada ao array.
    const next = new Date(last);
    // Clona essa data para poder modificar sem alterar o objeto original.
    next.setDate(last.getDate() + 1);
    // Ajusta a cópia para o dia seguinte (avança uma data).
    days.push({ date: next, isOtherMonth: true });
    // Adiciona esse dia do mês seguinte ao array, marcando isOtherMonth = true.
  }*/

  // Completa até ter no mínimo 6 linhas (42 dias) (7*6)
  while (days.length < 42) {
    const last = days[days.length - 1].date;
    const next = new Date(last);
    next.setDate(last.getDate() + 1);
    days.push({ date: next, isOtherMonth: true });
  }

  const headers = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return { headers, days };
}

function DayShiftDetails({ shift }: { shift: ShiftDto }) {
  const { data: full } = useShiftCompleteView(shift.id);
  const start = new Date(shift.startDate);
  const end = new Date(shift.endDate);

  const confirmedVolunteers = shift.positions?.reduce(
    (sum, p) => sum + (p.volunteersCount || 0),
    0
  );

  const totalVolunteersNeeded = shift.positions?.reduce(
    (sum, p) => sum + (p.requiredCount || 0),
    0
  );

  return (
    <Card className="border">
      <CardContent className="pt-2 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Link
              to={`/shifts/${shift.id}`}
              className="font-medium hover:underline hover:text-primary"
            >
              {shift.title || "Escala"}
            </Link>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>
                {format(start, "dd/MM/yyyy HH:mm")} -{" "}
                {format(end, "dd/MM/yyyy HH:mm")} (
                {formatShiftDuration(start, end)})
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2">
          <div className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Voluntários {confirmedVolunteers || 0} /{" "}
            {totalVolunteersNeeded || 0}{" "}
          </div>
          {full?.positions?.length ? (
            <div className="mt-2 space-y-2">
              {full.positions.map((pos) => {
                const allConfirmed =
                  pos.volunteers.length > 0 &&
                  pos.volunteers.every(
                    (v) => v.status === VolunteerStatus.CONFIRMED
                  );

                const allCancelled =
                  pos.volunteers.length > 0 &&
                  pos.volunteers.every(
                    (v) => v.status === VolunteerStatus.CANCELLED
                  );

                return (
                  <div key={pos.id} className="rounded-md border p-2">
                    <div className="flex gap-2 items-center">
                      {allConfirmed ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : allCancelled ? (
                        <X className="w-4 h-4 text-red-600" />
                      ) : (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}

                      <span className="text-sm font-medium">
                        {pos.positionName}
                      </span>
                    </div>

                    {pos.volunteers.length > 0 ? (
                      <ul className="mt-1 space-y-1">
                        {pos.volunteers.map((v) => (
                          <li
                            key={v.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="pl-4 flex items-center justify-center gap-2">
                              <div
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  v.status == VolunteerStatus.CANCELLED &&
                                    "bg-red-400",
                                  v.status == VolunteerStatus.PENDING &&
                                    "bg-amber-500",
                                  v.status == VolunteerStatus.CONFIRMED &&
                                    "bg-green-600"
                                )}
                              />
                              <span>{v.userName}</span>
                            </div>
                            <Badge variant="outline">
                              {VolunteerStatusToReadableFormat(v.status)}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-xs text-muted-foreground mt-1">
                        Sem voluntários
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground mt-1">
              Carregando voluntários...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
