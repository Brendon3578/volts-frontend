/**
 * Shift Detail Page
 * Shows detailed information about a specific shift
 */

import { useParams, useNavigate } from "react-router-dom";
import { useShift } from "../hooks/useShiftsOLDDDD";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { SignupPositionDialog } from "../components/layout/SignupPositionDialog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  UserCheck,
  UserMinus,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { VolunteerStatusType } from "../models";
import { ShiftStatus, VolunteerStatus } from "../models";

export function ShiftDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    shift,
    loading,
    signupForShift,
    cancelSignup,
    updateVolunteerStatus,
  } = useShift(id!);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">
              Escala não encontrada
            </h2>
            <p className="text-muted-foreground mb-4">
              A escala que você está procurando não existe ou foi removida.
            </p>
            <Button onClick={() => navigate("/groups")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar aos Grupos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: VolunteerStatusType) => {
    switch (status) {
      case VolunteerStatus.CONFIRMED:
        return <CheckCircle className="h-4 w-4 text-success" />;
      case VolunteerStatus.PENDING:
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case VolunteerStatus.CANCELLED:
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusText = (status: VolunteerStatusType) => {
    switch (status) {
      case VolunteerStatus.CONFIRMED:
        return "Confirmado";
      case VolunteerStatus.PENDING:
        return "Pendente";
      case VolunteerStatus.CANCELLED:
        return "Cancelado";
    }
  };

  const formatDate = (date: Date) => {
    return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  const isUpcoming = shift.date >= new Date();
  const isPast = shift.date < new Date();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/groups/${shift.group?.id || ""}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Grupo
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {shift.title || "Escala"}
              </h1>
              {shift.group && (
                <p className="text-muted-foreground text-lg mb-4">
                  {shift.group.name}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant={
                    shift.status === ShiftStatus.OPEN
                      ? "default"
                      : shift.status === ShiftStatus.FILLED
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {shift.status === ShiftStatus.OPEN
                    ? "Aberto"
                    : shift.status === ShiftStatus.FILLED
                    ? "Preenchido"
                    : "Cancelado"}
                </Badge>
                {isPast && <Badge variant="outline">Finalizado</Badge>}
              </div>

              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(shift.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                  </span>
                </div>
              </div>

              {shift.notes && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Observações:</h3>
                  <p className="text-muted-foreground">{shift.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Positions */}
          <div className="lg:col-span-2">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Posições Disponíveis</CardTitle>
                <CardDescription>
                  Confira as posições e voluntários para esta escala
                </CardDescription>
              </CardHeader>
              <CardContent>
                {shift.positions.length > 0 ? (
                  <div className="space-y-6">
                    {shift.positions.map((shiftPosition) => (
                      <div
                        key={shiftPosition.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {shiftPosition.position.name}
                              </h3>
                              {shiftPosition.position.description && (
                                <p className="text-sm text-muted-foreground">
                                  {shiftPosition.position.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              {shiftPosition.volunteersCount} /{" "}
                              {shiftPosition.requiredCount}
                            </div>
                            {isUpcoming &&
                              shift.status === ShiftStatus.OPEN &&
                              shiftPosition.volunteersCount <
                                shiftPosition.requiredCount && (
                                <SignupPositionDialog
                                  positionName={shiftPosition.position.name}
                                  onSignup={(data) =>
                                    signupForShift(shiftPosition.id, data)
                                  }
                                />
                              )}
                          </div>
                        </div>

                        {/* Volunteers */}
                        {shiftPosition.volunteers.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Voluntários:
                            </h4>
                            {shiftPosition.volunteers.map((volunteer) => (
                              <div
                                key={volunteer.id}
                                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">
                                      {volunteer.user?.name}
                                    </p>
                                    {volunteer.notes && (
                                      <p className="text-xs text-muted-foreground">
                                        {volunteer.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(volunteer.status)}
                                  <span className="text-xs font-medium">
                                    {getStatusText(volunteer.status)}
                                  </span>
                                  {volunteer.status ===
                                    VolunteerStatus.PENDING && (
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          updateVolunteerStatus(
                                            volunteer.id,
                                            VolunteerStatus.CONFIRMED
                                          )
                                        }
                                      >
                                        <UserCheck className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          cancelSignup(volunteer.id)
                                        }
                                      >
                                        <UserMinus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {shiftPosition.volunteers.length === 0 && (
                          <div className="text-center py-4 text-muted-foreground">
                            <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">
                              Nenhum voluntário inscrito
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Nenhuma posição definida
                    </h3>
                    <p className="text-muted-foreground">
                      Esta escala ainda não possui posições configuradas.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shift Info */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-base">
                  Informações da Escala
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant={
                      shift.status === ShiftStatus.OPEN
                        ? "default"
                        : shift.status === ShiftStatus.FILLED
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {shift.status === ShiftStatus.OPEN
                      ? "Aberto"
                      : shift.status === ShiftStatus.FILLED
                      ? "Preenchido"
                      : "Cancelado"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data</span>
                  <span className="text-sm font-medium">
                    {format(shift.date, "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Horário</span>
                  <span className="text-sm font-medium">
                    {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Posições
                  </span>
                  <span className="text-sm font-medium">
                    {shift.positions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Voluntários
                  </span>
                  <span className="text-sm font-medium">
                    {shift.positions.reduce(
                      (acc, pos) => acc + pos.volunteersCount,
                      0
                    )}{" "}
                    /{" "}
                    {shift.positions.reduce(
                      (acc, pos) => acc + pos.requiredCount,
                      0
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-base">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Confirmados</span>
                  </div>
                  <span className="font-semibold">
                    {shift.positions.reduce(
                      (acc, pos) =>
                        acc +
                        pos.volunteers.filter(
                          (v) => v.status === VolunteerStatus.CONFIRMED
                        ).length,
                      0
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <span className="text-sm">Pendentes</span>
                  </div>
                  <span className="font-semibold">
                    {shift.positions.reduce(
                      (acc, pos) =>
                        acc +
                        pos.volunteers.filter(
                          (v) => v.status === VolunteerStatus.PENDING
                        ).length,
                      0
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Vagas Abertas</span>
                  </div>
                  <span className="font-semibold">
                    {shift.positions.reduce(
                      (acc, pos) =>
                        acc +
                        Math.max(0, pos.requiredCount - pos.volunteersCount),
                      0
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
