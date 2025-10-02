/**
 * Groups Page
 * Lists all groups with search and filter functionality
 */

import { useGroups } from "../../hooks/useGroups";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { GroupCard } from "../../components/layout/GroupCard";
import { CreateGroupDialog } from "../../components/layout/CreateGroupDialog";
import { Search, Users, Activity, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Groups() {
  const { groups, loading, createGroup, joinGroup, leaveGroup } = useGroups();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.description &&
        group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <section className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/discover")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar à Página Inicial
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Grupos</h1>
              <p className="text-muted-foreground">
                Explore e participe dos grupos disponíveis
              </p>
            </div>
            <CreateGroupDialog
              onCreateGroup={createGroup}
              trigger={
                <Button>
                  <Activity className="h-4 w-4 mr-2" />
                  Novo Grupo
                </Button>
              }
            />
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar grupos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            {/* <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button> */}
          </div>
        </section>

        {/* Groups Grid */}
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onJoin={joinGroup}
                onLeave={leaveGroup}
              />
            ))}
          </div>
        ) : searchTerm ? (
          <Card className="card-elevated text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum grupo encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Tente ajustar sua busca ou criar um novo grupo
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Limpar Busca
                </Button>
                <CreateGroupDialog
                  onCreateGroup={createGroup}
                  trigger={
                    <Button variant={"secondary"}>
                      <Activity className="mr-2 h-4 w-4" />
                      Criar Novo Grupo
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="card-elevated text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum grupo cadastrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Crie o primeiro grupo para começar a organizar suas atividades
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
    </div>
  );
}

export default Groups;
