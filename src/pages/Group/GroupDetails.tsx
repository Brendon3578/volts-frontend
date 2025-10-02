/**
 * Group Detail Page
 * Shows detailed information about a specific group
 */

import { useParams, useNavigate } from "react-router-dom";
import { useGroup } from "../../hooks/useGroups";
import { useShifts } from "../../hooks/useShifts";
import { usePositions } from "../../hooks/usePositions";
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
  User,
} from "lucide-react";
import { format } from "date-fns";
import { useAuthentication } from "../../hooks/useAuthentication";
import { PositionFormDialog } from "../../components/layout/PositionFormDialog";
import { PositionsTable } from "../../components/layout/tables/PositionsTable";
import { GroupTitle } from "./GroupTitle";

export function GroupDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { group, loading: groupLoading } = useGroup(id!);
  const { shifts, loading: shiftsLoading, createShift } = useShifts(id);
  const {
    positions,
    loading: positionsLoading,
    createPosition,
    updatePosition,
    deletePosition,
  } = usePositions(id);

  const { user } = useAuthentication();

  if (groupLoading) {
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Grupo não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              O grupo que você está procurando não existe ou foi removido.
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

  const upcomingShifts = shifts.filter(
    (shift) => new Date(shift.date) >= new Date()
  );
  const pastShifts = shifts.filter(
    (shift) => new Date(shift.date) < new Date()
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <section className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/groups")}
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
                  <Users className="mr-1 h-3 w-3" />
                  {group.members.length} membros
                </Badge>
                <Badge variant="outline">
                  <Calendar className="mr-1 h-3 w-3" />
                  {upcomingShifts.length} próximas escalas
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/groups/${group.id}/settings`)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <main className="lg:col-span-3">
            <Tabs defaultValue="shifts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="shifts">Escalas</TabsTrigger>
                <TabsTrigger value="positions">Posições</TabsTrigger>
                <TabsTrigger value="members">Membros</TabsTrigger>
              </TabsList>

              <TabsContent value="shifts" className="space-y-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold">Escalas do Grupo</h2>
                  {!positionsLoading && positions.length > 0 && (
                    <CreateShiftDialog
                      groupId={group.id}
                      positions={positions}
                      onCreateShift={createShift}
                    />
                  )}
                </div>

                {shiftsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : upcomingShifts.length > 0 || pastShifts.length > 0 ? (
                  <div className="space-y-6">
                    {upcomingShifts.length > 0 && (
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

                    {pastShifts.length > 0 && (
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
                        {positions.length === 0
                          ? "Crie posições primeiro, depois adicione escalas"
                          : "Crie a primeira escala para este grupo"}
                      </p>
                      {positions.length > 0 && (
                        <CreateShiftDialog
                          groupId={group.id}
                          positions={positions}
                          onCreateShift={createShift}
                        />
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="positions" className="space-y-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold">Posições do Grupo</h2>
                  <PositionFormDialog
                    group={group}
                    onCreatePosition={createPosition}
                  />

                  {/* <Button
                    onClick={() =>
                      createPosition({
                        name: "Nova Posição",
                        description: "",
                        groupId: group.id,
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Posição
                  </Button> */}
                </div>

                <PositionsTable
                  positions={positions}
                  group={group}
                  onUpdatePosition={updatePosition}
                  onDeletePosition={(p) => deletePosition(p.id)}
                />

                {/* {positionsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-48" />
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : positions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {positions.map((position) => (
                      <Card key={position.id} className="card-elevated">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {position.name}
                          </CardTitle>
                          {position.description && (
                            <CardDescription>
                              {position.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Nenhuma posição cadastrada
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Crie posições para organizar as responsabilidades nas
                        escalas
                      </p>

                      <Button
                        onClick={() =>
                          createPosition({
                            name: "Nova Posição",
                            description: "",
                            groupId: group.id,
                          })
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeira Posição
                      </Button>
                    </CardContent>
                  </Card>
                )} */}
              </TabsContent>

              <TabsContent value="members" className="space-y-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold">Membros do Grupo</h2>
                  <Badge variant="outline">
                    {group.members.length} membros
                  </Badge>
                </div>

                {group.members.length > 0 ? (
                  <div className="space-y-4">
                    {group.members.map((member) => (
                      <Card key={member.id} className="card-elevated">
                        <CardContent className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border-secondary/20 border shadow-sm">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{member.user?.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {member.user?.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {member.userId == user?.id && (
                              <Badge
                                variant={"secondary"}
                                className="bg-emerald-500"
                              >
                                Você
                              </Badge>
                            )}
                            <Badge variant="secondary">
                              {member.role === "GROUP_LEADER"
                                ? "Líder"
                                : member.role === "COORDINATOR"
                                ? "Coordenador"
                                : "Voluntário"}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              Entrou em{" "}
                              {format(new Date(member.joinedAt), "dd/MM/yyyy")}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Nenhum membro encontrado
                      </h3>
                      <p className="text-muted-foreground">
                        Este grupo ainda não possui membros além do criador.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </main>

          {/* Sidebar */}
          <section className="space-y-6">
            {/* Group Stats */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-base">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Membros</span>
                  </div>
                  <span className="font-semibold">{group.members.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Posições</span>
                  </div>
                  <span className="font-semibold">{positions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Próximas</span>
                  </div>
                  <span className="font-semibold">{upcomingShifts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Anteriores</span>
                  </div>
                  <span className="font-semibold">{pastShifts.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-base">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {positions.length > 0 && (
                  <CreateShiftDialog
                    groupId={group.id}
                    positions={positions}
                    onCreateShift={createShift}
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
                  onCreatePosition={createPosition}
                  trigger={
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Posição
                    </Button>
                  }
                />

                {/* <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    createPosition({
                      name: "Nova Posição",
                      description: "",
                      groupId: group.id,
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Posição
                </Button> */}
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Convidar Membros
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
