import { Link } from "react-router-dom";
import type { UserOrganization } from "../../../models/organization";
import { Badge } from "../../ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/card";
import {
  GroupRoleToReadableFormat,
  OrganizationRoleToReadableFormat,
} from "../../../utils";

export function UserOrganizationCard({ org }: { org: UserOrganization }) {
  return (
    <Card key={org.organizationId} className="w-full gap-2">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Link
            to={`/organizations/${org.organizationId}`}
            className="hover:underline w-full"
          >
            <CardTitle>{org.organizationName}</CardTitle>
            <CardDescription>{org.organizationDescription}</CardDescription>
          </Link>
          <Badge>
            {OrganizationRoleToReadableFormat(org.organizationUserRole)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-2 text-sm">
          Grupos ({org.groups.length})
        </h3>
        {org.groups.length > 0 ? (
          <div className="space-y-2 max-h-[180px] overflow-y-scroll pr-2">
            {org.groups.map((group) => (
              <Link
                to={`/groups/${group.groupId}`}
                key={group.groupId}
                className="block group border rounded-lg p-3 px-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm group-hover:underline">
                      {group.groupName}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {group.groupDescription}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {GroupRoleToReadableFormat(group.memberRole)}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Nenhum grupo nesta organização.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
