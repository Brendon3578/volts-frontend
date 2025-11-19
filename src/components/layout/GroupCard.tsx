/**
 * Group Card Component
 * Displays group information in a card format
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, ArrowRight, CalendarClock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GroupIconContainer } from "../../pages/Group/GroupIconContainer";
import type { GroupCompleteViewDto } from "../../api/types/group";
import { cn } from "../../lib/utils";

interface GroupCardProps {
  group: GroupCompleteViewDto;
}

export function GroupCard({ group }: GroupCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/groups/${group.id}`);
  };

  return (
    <Card className="card-elevated justify-between" onClick={handleViewDetails}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex">
              <GroupIconContainer
                groupIconId={group.icon}
                color={group.color}
              />
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {group.name}
                </CardTitle>
                <CardDescription
                  className={cn(
                    "mt-1",
                    group.description ? "line-clamp-2" : "italic text-gray-500"
                  )}
                >
                  {group.description || "Sem descrição"}
                </CardDescription>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{group.totalShiftsCount || 0} escalas </span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarClock className="h-4 w-4" />
              <span>{group.upcomingShiftsCount || 0} próximas</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant={"outline"} size="sm" className="shrink-0">
              Acessar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
