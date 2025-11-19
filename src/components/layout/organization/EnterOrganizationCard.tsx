import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/card";
import { LogIn, Users } from "lucide-react";
import { Button } from "../../ui/button";
import type { Organization } from "../../../models";

interface EnterOrganizationCardProps {
  org: Organization;
}

export function EnterOrganizationCard({ org }: EnterOrganizationCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/organizations/${org.id}`);
  };

  return (
    <Card className="card-elevated " onClick={handleViewDetails}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {org.name}
              </CardTitle>
              {org.description && (
                <CardDescription className="mt-1 line-clamp-2">
                  {org.description}
                </CardDescription>
              )}
            </div>
          </div>
          {/* {isJoined && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              Membro
            </Badge>
          )} */}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-col gap-2 text-sm text-muted-foreground 2xl:flex-row 2xl:gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {/* <span>{group.memberCount || 0} membros</span> */}
              <span>+5 membros</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              // onClick={handleJoinLeave}
              className="shrink-0"
            >
              Entrar
              <LogIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
