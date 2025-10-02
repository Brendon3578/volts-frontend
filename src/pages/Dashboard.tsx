import { useDashboard } from "../hooks/useDashboard.ts";
import { useGroups } from "../hooks/useGroups.ts";
import VoltsLogo from "@/assets/Volts_lg.svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import { Skeleton } from "../components/ui/skeleton.tsx";
import { GroupCard } from "../components/layout/GroupCard.tsx";
import { CreateGroupDialog } from "../components/layout/CreateGroupDialog.tsx";
import {
  Users,
  Calendar,
  Clock,
  AlertCircle,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const navigate = useNavigate();
  const { summary, loading: summaryLoading } = useDashboard();
  const {
    groups,
    loading: groupsLoading,
    createGroup,
    joinGroup,
    leaveGroup,
  } = useGroups();

  const recentGroups = groups.slice(0, 3);

  if (summaryLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="hero-gradient text-white">
        <div className="container mx-auto px-4 py-28">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <img src={VoltsLogo} className="size-20" />
              <h2 className="text-5xl font-bold">Volts</h2>
            </div>
            <h1 className="text-3xl md:text-6xl font-bold mb-6">
              Sistema de Gerenciamento de Voluntários
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 text-center">
              Organize escalas, gerencie grupos e coordene atividades
              voluntárias com facilidade
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant={"secondary"}
                onClick={() => navigate("/groups")}
                className="cursor-pointer text-lg px-8 py-6"
              >
                <Users className="mr-2 h-5 w-5" />
                Ver Grupos
              </Button>
              <CreateGroupDialog
                onCreateGroup={createGroup}
                trigger={
                  <Button
                    size="lg"
                    variant="outline"
                    className="cursor-pointer text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-zinc-800"
                  >
                    <Activity className="mr-2 h-5 w-5" />
                    Criar Grupo
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="card-elevated gap-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Grupos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {summary.totalGroups}
              </div>
              <p className="text-xs text-muted-foreground">
                Grupos ativos na plataforma
              </p>
            </CardContent>
          </Card>

          <Card className="card-elevated gap-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Próximas Escalas
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-secondary">
                {summary.totalUpcomingShifts}
              </div>
              <p className="text-xs text-muted-foreground">
                Escalas programadas
              </p>
            </CardContent>
          </Card>

          <Card className="card-elevated gap-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Minhas Escalas
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-warning">
                {summary.myUpcomingShifts}
              </div>
              <p className="text-xs text-muted-foreground">
                Suas próximas participações
              </p>
            </CardContent>
          </Card>

          <Card className="card-elevated gap-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-destructive">
                {summary.pendingSignups}
              </div>
              <p className="text-xs text-muted-foreground">
                Inscrições aguardando confirmação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Groups Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Grupos Recentes
              </h2>
              <p className="text-muted-foreground">
                Confira os grupos mais ativos da plataforma
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/groups")}>
              Ver Todos
              <TrendingUp className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {groupsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="card-elevated">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onJoin={joinGroup}
                  onLeave={leaveGroup}
                />
              ))}
            </div>
          ) : (
            <Card className="card-elevated text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhum grupo encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Crie seu primeiro grupo para começar a organizar suas
                  atividades
                </p>
                <CreateGroupDialog
                  onCreateGroup={createGroup}
                  trigger={
                    <Button>
                      <Activity className="mr-2 h-4 w-4" />
                      Criar Primeiro Grupo
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-2xl">Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => navigate("/groups")}
              >
                <Users className="h-6 w-6" />
                Gerenciar Grupos
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => navigate("/my-shifts")}
              >
                <Calendar className="h-6 w-6" />
                Minhas Escalas
              </Button>
              <CreateGroupDialog
                onCreateGroup={createGroup}
                trigger={
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Activity className="h-6 w-6" />
                    Novo Grupo
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
