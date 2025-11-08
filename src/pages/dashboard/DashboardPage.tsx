import { useUserOrganizations } from "@/hooks/useUserOrganizations";
import { useAvailableOrganizations } from "@/hooks/useAvailableOrganizations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

export default function DashboardPage() {
  const userOrgs = useUserOrganizations();
  const availableOrgs = useAvailableOrganizations();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Seção de Organizações do Usuário */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Minhas Organizações</h2>

        {userOrgs.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <UserOrgsSkeletonCard key={i} />
            ))}
          </div>
        ) : userOrgs.isError ? (
          <Card className="bg-red-50">
            <CardHeader>
              <CardTitle>Erro ao carregar organizações</CardTitle>
              <CardDescription>
                Não foi possível carregar suas organizações. Tente novamente
                mais tarde.
              </CardDescription>
            </CardHeader>
          </Card>
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
              <Card key={org.organizationId} className="w-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{org.organizationName}</CardTitle>
                      <CardDescription>
                        {org.organizationDescription}
                      </CardDescription>
                    </div>
                    <Badge>{org.organizationUserRole}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium mb-2">
                    Grupos ({org.groups.length})
                  </h3>
                  {org.groups.length > 0 ? (
                    <div className="space-y-4">
                      {org.groups.map((group) => (
                        <div
                          key={group.groupId}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{group.groupName}</h4>
                              <p className="text-sm text-gray-500">
                                {group.groupDescription}
                              </p>
                            </div>
                            <Badge variant="outline">{group.memberRole}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Nenhum grupo nesta organização.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-8" />

      {/* Seção de Organizações Disponíveis */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Organizações Disponíveis
        </h2>

        {availableOrgs.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : availableOrgs.isError ? (
          <Card className="bg-red-50">
            <CardHeader>
              <CardTitle>Erro ao carregar organizações disponíveis</CardTitle>
              <CardDescription>
                Não foi possível carregar as organizações disponíveis. Tente
                novamente mais tarde.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : availableOrgs.data?.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhuma organização disponível</CardTitle>
              <CardDescription>
                Não há organizações disponíveis no momento.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableOrgs.data?.map((org) => (
              <Card key={org.id} className="w-full">
                <CardHeader>
                  <CardTitle>{org.name}</CardTitle>
                  <CardDescription>{org.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {org.email && (
                      <p className="text-sm">
                        <span className="font-medium">Email:</span> {org.email}
                      </p>
                    )}
                    {org.phone && (
                      <p className="text-sm">
                        <span className="font-medium">Telefone:</span>{" "}
                        {org.phone}
                      </p>
                    )}
                    {org.address && (
                      <p className="text-sm">
                        <span className="font-medium">Endereço:</span>{" "}
                        {org.address}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
