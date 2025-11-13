/**
 * Group Card Component
 * Displays group information in a card format
 */

import React from "react";
import type { Group } from "../../models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Users, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GroupIconContainer } from "../../pages/Group/GroupIconContainer";
import type { GroupCompleteViewDto, GroupDto } from "../../api/types/group";
import { cn } from "../../lib/utils";

interface GroupCardProps {
  group: GroupCompleteViewDto;
  onJoin?: (groupId: string) => void;
  onLeave?: (groupId: string) => void;
  isJoined?: boolean;
  showJoinButton?: boolean;
}

export function GroupCard({
  group,
  onJoin,
  onLeave,
  showJoinButton = true,
}: GroupCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/groups/${group.id}`);
  };

  const handleJoinLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (group.isCurrentUserJoined) {
      onLeave?.(group.id);
    } else {
      onJoin?.(group.id);
    }
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
          {group.isCurrentUserJoined && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              Membro
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-col gap-2 text-sm text-muted-foreground 2xl:flex-row 2xl:gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{group.memberCount || 0} membros</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{group.upcomingShiftsCount || 0} próximas</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {group.isCurrentUserJoined && (
              <Button
                variant={group.isCurrentUserJoined ? "outline" : "secondary"}
                size="sm"
                onClick={handleJoinLeave}
                className="shrink-0"
              >
                {group.isCurrentUserJoined ? "Entrar" : "Acessar"}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleViewDetails}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
