/**
 * Shift Card Component
 * Displays shift information in a card format
 */

import React from "react";
import type { Shift, ShiftStatusType } from "../../models/types";
import { ShiftStatus } from "../../models/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Clock, Calendar, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ShiftCardProps {
  shift: Shift;
  showActions?: boolean;
}

const getStatusVariant = (status: ShiftStatusType) => {
  switch (status) {
    case ShiftStatus.OPEN:
      return "default";
    case ShiftStatus.FILLED:
      return "secondary";
    case ShiftStatus.CANCELLED:
      return "destructive";
    default:
      return "default";
  }
};

const getStatusText = (status: ShiftStatusType) => {
  switch (status) {
    case ShiftStatus.OPEN:
      return "Aberto";
    case ShiftStatus.FILLED:
      return "Preenchido";
    case ShiftStatus.CANCELLED:
      return "Cancelado";
    default:
      return status;
  }
};

export const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  showActions = true,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/shifts/${shift.id}`);
  };

  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  const isUpcoming = shift.date >= new Date();
  const isPast = shift.date < new Date();

  return (
    <Card
      className={`card-elevated cursor-pointer ${isPast ? "opacity-75" : ""}`}
      onClick={handleViewDetails}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg font-semibold text-foreground">
                {shift.title || "Escala"}
              </CardTitle>
              <Badge variant={getStatusVariant(shift.status)}>
                {getStatusText(shift.status)}
              </Badge>
              {isPast && (
                <Badge variant="outline" className="text-xs">
                  Finalizado
                </Badge>
              )}
            </div>
            {shift.notes && (
              <CardDescription className="line-clamp-2">
                {shift.notes}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(shift.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {shift.confirmedVolunteers || 0} /{" "}
              {shift.totalVolunteersNeeded || 0} voluntários
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {isUpcoming && shift.status === ShiftStatus.OPEN && (
              <span className="text-primary font-medium">
                Inscrições abertas
              </span>
            )}
            {shift.status === ShiftStatus.FILLED && (
              <span className="text-secondary font-medium">
                Vagas preenchidas
              </span>
            )}
            {shift.status === ShiftStatus.CANCELLED && (
              <span className="text-destructive font-medium">Cancelado</span>
            )}
          </div>

          {showActions && (
            <Button variant="ghost" size="sm" onClick={handleViewDetails}>
              Ver detalhes
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
