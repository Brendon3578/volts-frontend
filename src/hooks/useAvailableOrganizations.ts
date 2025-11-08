import { useQuery } from "@tanstack/react-query";
import type { Organization } from "../models";
import { getAvailableOrganizations } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

export function useAvailableOrganizations() {
  //const { state } = useAuth();
  //const userId = state.user?.id; // validar isso aqui

  return useQuery<Organization[]>({
    //queryKey: ["availableOrganizations", userId],
    queryKey: ["availableOrganizations"],
    retry: 1,
    //enabled: !!userId,
    queryFn: getAvailableOrganizations,
  });
}
