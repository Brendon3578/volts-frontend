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

export function UserOrganizationCard({ org }: { org: UserOrganization }) {
  return (
    <Card key={org.organizationId} className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Link
            to={`/organizations/${org.organizationId}`}
            className="hover:underline w-full"
          >
            <CardTitle>{org.organizationName}</CardTitle>
            <CardDescription>{org.organizationDescription}</CardDescription>
          </Link>
          <Badge>{org.organizationUserRole}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-2 text-sm">
          Grupos ({org.groups.length})
        </h3>
        {org.groups.length > 0 ? (
          <div className="space-y-4">
            {org.groups.map((group) => (
              <div key={group.groupId} className="border rounded-lg p-4">
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
  );
}
