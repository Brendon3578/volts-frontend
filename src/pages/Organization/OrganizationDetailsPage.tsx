import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useJoinOrganization,
  useLeaveOrganization,
  useOrganizationById,
  useOrganizationCompleteViewById,
} from "../../hooks/useOrganizations";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Activity,
  AlertCircleIcon,
  ArrowLeft,
  Building2,
  CircleAlert,
  Leaf,
  LogIn,
  LogOut,
  Search,
  Settings2,
  Users,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { CreateGroupDialog } from "../../components/layout/CreateGroupDialog";
import { Separator } from "../../components/ui/separator";
import { GroupList } from "@/components/groups/GroupList";
import {
  useGroupsCompleteViewByOrganizationId,
  useLeaveGroup,
} from "../../hooks/useGroups";
import { GroupCard } from "../../components/layout/GroupCard";
import {
  isUserOrganizationAdmin,
  isUserOrganizationLeaderOrAdmin,
} from "../../utils";
import { WithPermission } from "../../components/common/WithPermission";
import { toast } from "sonner";
import { ConfirmActionDialog } from "../../components/common/ConfirmActionDialog";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

export function OrganizationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const {
    data: organization,
    isError,
    isLoading,
    refetch: refetchOrganization,
  } = useOrganizationCompleteViewById(id);

  const isJoined = organization?.isCurrentUserJoined ?? false;

  const { data: detailedGroups, refetch: refetchGroups } =
    useGroupsCompleteViewByOrganizationId(isJoined ? id : undefined);

  const { mutateAsync: joinOrg, isPending: isJoiningOrg } =
    useJoinOrganization();

  const { mutateAsync: leaveOrg } = useLeaveOrganization();

  async function userJoinGroup() {
    try {
      if (!id) return;
      await joinOrg(id);
      toast.success("Entrou na organização com sucesso");

      refetchOrganization();
      refetchGroups();
    } catch {
      toast.error("Falha ao entrar na organização");
    }
  }

  async function userLeaveOrganization() {
    try {
      if (!id) return;
      await leaveOrg(id);
      toast.success("Saiu na organização com sucesso");

      refetchOrganization();
      refetchGroups();
    } catch {
      toast.error("Falha ao sair da organização");
    }
  }

  const filteredGroups = detailedGroups?.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.description &&
        group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isCurrentUserLeaderOrAdmin = isUserOrganizationLeaderOrAdmin(
    organization?.currentUserOrganizationRole
  );

  const isCurrentUserAdmin = isUserOrganizationAdmin(
    organization?.currentUserOrganizationRole
  );

  if (isLoading) {
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

  if (!id || isError || !organization) {
    return (
      <div className="flex  items-center justify-center py-[10vh]">
        <div className="text-center">
          <h1 className="mb-4 text-8xl font-bold">404</h1>
          <p className="mb-4 text-xl text-gray-600">
            Organização não encontrada!
          </p>
          <Button
            className="text-blue-500 underline hover:text-blue-700"
            variant={"ghost"}
            onClick={() => navigate(-1)}
          >
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Organization Header */}

      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar à Página Inicial
      </Button>

      <section>
        <div className="flex gap-4">
          <div className="p-2 bg-secondary rounded-md h-min">
            <Building2 className="w-6 h-6  text-gray-700" />
          </div>

          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold text-foreground">
                {organization.name}
              </h2>
              <p className="text-muted-foreground">
                {organization.description}
              </p>
            </div>
            {/* <CreateGroupDialog */}
            {/* onCreateGroup={createGroup} */}
            {/* trigger={ */}

            <div className="flex gap-4">
              <WithPermission can={isCurrentUserLeaderOrAdmin}>
                <Button
                  variant={"outline"}
                  title="Configurações da organização"
                  onClick={() =>
                    navigate(`/organizations/${organization.id}/settings`)
                  }
                >
                  <Settings2 className="h-4 w-4" />
                  Configurações
                </Button>
              </WithPermission>

              <WithPermission can={isJoined}>
                <ConfirmActionDialog
                  onConfirm={userLeaveOrganization}
                  title={`Sair da ${organization.name}`}
                  description={`Tem certeza que quer sair da Organização?`}
                  trigger={
                    <Button title="Sair da organização" variant={"destructive"}>
                      <LogOut className="h-4 w-4" />
                      Sair
                    </Button>
                  }
                >
                  {isCurrentUserAdmin && (
                    <Alert variant="destructive" className="">
                      <AlertCircleIcon />
                      <AlertTitle className="text-lg">Atenção</AlertTitle>
                      <AlertDescription className="text-base">
                        Você é Administrador da organização, se você sair a
                        organização será apagada!
                      </AlertDescription>
                    </Alert>
                  )}
                </ConfirmActionDialog>
              </WithPermission>

              <WithPermission can={!isJoined}>
                <Button
                  title="Entrar na organizaçãoo"
                  className="bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => userJoinGroup()}
                >
                  <LogIn className="h-4 w-4" />
                  {isJoiningOrg ? "Entrando" : "Entrar"}
                </Button>
              </WithPermission>
            </div>

            {/* // } */}
            {/* // /> */}
          </div>
        </div>
      </section>

      <Separator className="my-8 " />

      {/* Groups Header */}

      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Grupos</h2>
            <p className="text-muted-foreground">
              Explore e participe dos grupos disponíveis
            </p>
          </div>

          <WithPermission can={isCurrentUserLeaderOrAdmin}>
            <CreateGroupDialog organizationId={organization.id} />
          </WithPermission>
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
              disabled={!isJoined}
            />
          </div>
          {/* <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button> */}
        </div>

        {/* Groups Grid */}
        {isJoined == false ? (
          <NotPermissionToSeeGroups />
        ) : filteredGroups && filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
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
                  organizationId={organization.id}
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
                organizationId={organization.id}
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

        {/* <GroupList /> */}
      </section>
    </div>
  );
}

function NotPermissionToSeeGroups() {
  return (
    <Card className="card-elevated text-center py-12">
      <CardContent>
        <Leaf className="h-12 w-12 text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Você não tem permissão</h3>
        <p className="text-muted-foreground mb-6">
          Entre na organização para poder ver os grupos e acessar escalas
        </p>
      </CardContent>
    </Card>
  );
}
