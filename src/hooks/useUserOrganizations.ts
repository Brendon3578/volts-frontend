import { useQuery } from "@tanstack/react-query";
import type { UserOrganization } from "../models/organization";
import { getUserOrganizations } from "../api/endpoints";

export function useUserOrganizations() {
  return useQuery<UserOrganization[]>({
    queryKey: ["userOrganizations"],
    queryFn: getUserOrganizations,
  });
}
