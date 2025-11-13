import { useGroups } from "@/hooks/useGroups";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function GroupList() {
  const { data: groups, isLoading, error } = useGroups();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50">
        <CardHeader>
          <CardTitle>Erro ao carregar grupos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Não foi possível carregar os grupos. Tente novamente mais tarde.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhum grupo encontrado</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Você ainda não participa de nenhum grupo.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <Card key={group.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{group.name}</CardTitle>
              {group.color && (
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {group.description && (
              <p className="text-sm text-gray-600 mb-3">{group.description}</p>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Organização:</span>
                <Badge variant="outline">{group.organizationId}</Badge>
              </div>

              {group.icon && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ícone:</span>
                  <span>{group.icon}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Criado em:</span>
                <span>{new Date(group.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline">
                Ver Detalhes
              </Button>
              <Button size="sm" variant="outline" className="text-red-600">
                Sair do Grupo
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
