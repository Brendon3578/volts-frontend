/**
 * Group Detail Page
 * Shows detailed information about a specific group
 */

import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { ShiftCard } from "../../components/layout/ShiftCard";
import { CreateShiftDialog } from "../../components/layout/CreateShiftDialog";
import {
  ArrowLeft,
  Users,
  Calendar,
  Settings,
  Plus,
  MapPin,
  Clock,
  CalendarClock,
} from "lucide-react";
import { PositionFormDialog } from "../../components/layout/PositionFormDialog";
import { PositionsTable } from "../../components/layout/tables/PositionsTable";
import { GroupTitle } from "./GroupTitle";
import { useAuth } from "../../context/Auth/useAuth";
import { useGroupCompleteView } from "../../hooks/useGroups";
import { useShiftsByGroupId } from "../../hooks/useShifts";
import { usePositionsByGroupId } from "../../hooks/usePositions";
import { useMemo } from "react";
import { WithPermission } from "./../../components/common/WithPermission";
import { useSelfOrganizationRole } from "../../hooks/useOrganizations";
import { isUserOrganizationAdmin, isUserOrganizationLeader } from "../../utils";

export function GroupDetails() {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: group, isLoading: groupLoading } = useGroupCompleteView(
    groupId!
  );
  const { data: shifts, isLoading: shiftsLoading } = useShiftsByGroupId(
    groupId!
  );
  const { data: positions, isLoading: positionsLoading } =
    usePositionsByGroupId(groupId!);

  const { state } = useAuth();
  const { user } = state; // será usado depois

  const upcomingShifts = useMemo(
    () => shifts?.filter((s) => new Date(s.startDate) >= new Date()),
    [shifts]
  );

  const pastShifts = useMemo(
    () => shifts?.filter((s) => new Date(s.startDate) < new Date()),
    [shifts]
  );

  const { data: userRole, isLoading: roleLoading } = useSelfOrganizationRole(
    group?.organizationId
  );

  const isUserAdminOrLeader =
    isUserOrganizationAdmin(userRole?.role) ||
    isUserOrganizationLeader(userRole?.role);

  if (
    groupLoading ||
    positionsLoading ||
    shiftsLoading ||
    roleLoading ||
    !userRole
  ) {
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
                      <Skeleton key={i} className="h-24 w-full" />
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
                    {Array.from({ length: 4 }).map((_, i) => (
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

  if (!group) {
    return (
      <div className="w-full bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Grupo não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              O grupo que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar aos Grupos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <section className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/organizations/${group.organizationId}`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar aos Grupos
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <GroupTitle group={group} />
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <CalendarClock className="mr-1 h-3 w-3" />
                {group.upcomingShiftsCount || 0} próximas escalas
              </Badge>
              <Badge variant="outline">
                <Calendar className="mr-1 h-3 w-3" />
                {group.totalShiftsCount || 0} escalas
              </Badge>
            </div>
          </div>

          <WithPermission can={isUserAdminOrLeader}>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/groups/${group.id}/settings`)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Editar Grupo
              </Button>
            </div>
          </WithPermission>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Main Content */}
        <main className="lg:col-span-5">
          <Tabs defaultValue="shifts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-2 *:cursor-pointer">
              <TabsTrigger value="shifts">Escalas</TabsTrigger>
              <TabsTrigger value="positions">Posições</TabsTrigger>
            </TabsList>

            <TabsContent value="shifts" className="space-y-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold">Escalas do Grupo</h2>
                {isUserAdminOrLeader &&
                  !positionsLoading &&
                  positions &&
                  positions.length > 0 && (
                    <CreateShiftDialog
                      groupId={group.id}
                      positions={positions}
                    />
                  )}
              </div>

              {shiftsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : (upcomingShifts && upcomingShifts.length > 0) ||
                (pastShifts && pastShifts.length > 0) ? (
                <div className="space-y-6">
                  {upcomingShifts && upcomingShifts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-primary">
                        Próximas Escalas
                      </h3>
                      <div className="space-y-4">
                        {upcomingShifts.map((shift) => (
                          <ShiftCard key={shift.id} shift={shift} />
                        ))}
                      </div>
                    </div>
                  )}

                  {pastShifts && pastShifts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-muted-foreground">
                        Escalas Anteriores
                      </h3>
                      <div className="space-y-4">
                        {pastShifts.slice(0, 5).map((shift) => (
                          <ShiftCard key={shift.id} shift={shift} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Nenhuma escala encontrada
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {positions && positions.length === 0 ? (
                        <>
                          Crie{" "}
                          <span className="font-bold text-primary">
                            primeiro as posições
                          </span>
                          , depois adicione escalas
                        </>
                      ) : (
                        "Crie a primeira escala para este grupo"
                      )}
                    </p>
                    {isUserAdminOrLeader &&
                      positions &&
                      positions.length > 0 && (
                        <CreateShiftDialog
                          groupId={group.id}
                          positions={positions}
                        />
                      )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="positions" className="space-y-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold">Posições do Grupo</h2>
                <WithPermission can={isUserAdminOrLeader}>
                  <PositionFormDialog // refazer
                    group={group}
                  />
                </WithPermission>
              </div>

              <PositionsTable
                positions={positions}
                group={group}
                isUserAdminOrLeader={isUserAdminOrLeader}
              />
            </TabsContent>
          </Tabs>
        </main>

        {/* Sidebar */}
        <section className="lg:col-span-2 space-y-6">
          {/* Group Stats */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-base">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Posições</span>
                </div>
                <span className="font-semibold">{positions?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Próximas</span>
                </div>
                <span className="font-semibold">
                  {upcomingShifts?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Anteriores</span>
                </div>
                <span className="font-semibold">{pastShifts?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <WithPermission can={isUserAdminOrLeader}>
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-base">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {positions && positions.length > 0 && (
                  <CreateShiftDialog
                    groupId={group.id}
                    positions={positions}
                    trigger={
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Nova Escala
                      </Button>
                    }
                  />
                )}

                <PositionFormDialog
                  group={group}
                  trigger={
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Posição
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          </WithPermission>
        </section>
      </div>
    </div>
  );
}
