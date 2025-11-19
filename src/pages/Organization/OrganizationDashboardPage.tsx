/**
 * Groups Page
 * Lists all groups with search and filter functionality
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { Search, Users, TriangleAlert, Building2 } from "lucide-react";
import { useState } from "react";
import { EnterOrganizationCard } from "../../components/layout/organization/EnterOrganizationCard";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import { Separator } from "../../components/ui/separator";
import { CreateOrganizationDialog } from "../../components/layout/organization/CreateOrganizationDialog";
import { UserOrganizationCard } from "../../components/layout/organization/UserOrganizationCard";
import {
  useUserOrganizations,
  useAvailableOrganizations,
} from "../../hooks/useOrganizations";
import { useAuth } from "../../context/Auth/useAuth";

const UserOrgsSkeletonCard = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  );
};

export function OrganizationDashboardPage() {
  const {
    data: availableOrgs,
    isLoading,
    isError,
  } = useAvailableOrganizations();
  const [searchTerm, setSearchTerm] = useState("");

  const { state } = useAuth();
  const user = state.user;
  const userOrgs = useUserOrganizations(user?.id);

  const filteredOrgs = availableOrgs?.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.description &&
        org.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
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
    );
  }

  // const breadcrumbItem: BreadcrumbItemType = {
  //   label: "Dashboard",
  //   href: "/dashboard",
  // };

  return (
    <div>
      {/* <BreadcrumbCustom items={[breadcrumbItem]} /> */}
      {/* Header */}
      <section className="mb-8 mt-8">
        {/* <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar à Página Inicial
        </Button> */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Organizações
            </h1>
            <p className="text-muted-foreground">
              Veja suas organizações e descubra outras organizações disponíveis
              de trabalho voluntário.
            </p>
          </div>
          <CreateOrganizationDialog
            trigger={
              <Button>
                <Building2 className="h-5 w-5 mr-2" />
                Nova Organização
              </Button>
            }
          />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Minhas Organizações</h2>
          {userOrgs.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <UserOrgsSkeletonCard key={i} />
              ))}
            </div>
          ) : userOrgs.isError ? (
            <FetchErrorAlert />
          ) : userOrgs.data?.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Nenhuma organização encontrada</CardTitle>
                <CardDescription>
                  Você ainda não participa de nenhuma organização.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userOrgs.data?.map((org) => (
                <UserOrganizationCard org={org} key={org.organizationId} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Seção de Organizações Disponíveis */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold">Organizações Disponíveis</h2>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar organizações..."
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

        {/* Groups Grid */}

        {isError ? (
          <FetchErrorAlert />
        ) : filteredOrgs && filteredOrgs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredOrgs.map((org) => (
              <EnterOrganizationCard
                key={org.id}
                org={org}
                //onJoin={joinGroup}
                //onLeave={leaveGroup}
              />
            ))}
          </div>
        ) : searchTerm ? (
          <Card className="card-elevated text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma organização encontrada
              </h3>
              <p className="text-muted-foreground mb-6">
                Tente ajustar sua busca ou criar uma nova organização
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="ghost" onClick={() => setSearchTerm("")}>
                  Limpar Busca
                </Button>
                <CreateOrganizationDialog
                  //onCreateGroup={createGroup}
                  trigger={
                    <Button variant={"outline"}>
                      <Building2 className="mr-2 h-4 w-4" />
                      Criar Nova Organização
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
                Nenhuma organização encontrada
              </h3>
              <p className="text-muted-foreground mb-6">
                Crie a primeira organização para começar a gerenciar suas
                atividades
              </p>
              {/* <CreateGroupDialog
                  onCreateGroup={createGroup}
                  trigger={
                    <Button>
                      <Activity className="mr-2 h-4 w-4" />
                      Criar Primeiro Grupo
                    </Button>
                  }
                /> */}
            </CardContent>
          </Card>
        )}

        {/* <Separator className="my-8" /> */}

        {/* Seção de Meus Grupos */}
        {/* <div>
          <h2 className="text-2xl font-semibold mb-4">Meus Grupos</h2>
          <GroupList />
        </div> */}
      </section>
    </div>
  );
}

export function FetchErrorAlert() {
  return (
    <Alert variant="destructive" className="border-red-500/50 bg-red-50 ">
      <TriangleAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
      <AlertTitle>Erro ao buscar informações</AlertTitle>
      <AlertDescription>
        Não foi possível carregar as organizações disponíveis. Tente novamente
        mais tarde.
      </AlertDescription>
    </Alert>
  );
}
