import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as groupApi from "../api/endpoints/groupEndpoint";
import type { CreateGroupDto, UpdateGroupDto } from "../api/types/group";
import { useAuth } from "../context/Auth/useAuth";
import { DEFAULT_REACT_QUERY_STALE_TIME } from "../utils";

// Cache keys
const GROUPS_KEY = "groups";
const GROUP_KEY = "group";

export const useGroups = () => {
  const { state } = useAuth();
  const user = state.user;

  const queryKey = user ? [`${GROUPS_KEY}-${user.id}`] : [GROUPS_KEY];

  return useQuery({
    queryKey,
    queryFn: groupApi.getGroups,
    enabled: !!user,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useGroupsCompleteViewByOrganizationId = (
  organizationId?: string
) => {
  const { state } = useAuth();
  const user = state.user;

  const queryKey = user
    ? [organizationId, `${GROUPS_KEY}-${user.id}`]
    : [organizationId, GROUPS_KEY];

  return useQuery({
    queryKey,
    queryFn: () =>
      groupApi.getGroupsCompleteViewByOrganizationId(organizationId),
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useGroupCompleteView = (id: string) => {
  const { state } = useAuth();
  const user = state.user;

  const queryKey = user ? [`${GROUPS_KEY}-${user.id}`] : [GROUPS_KEY];

  return useQuery({
    queryKey,
    queryFn: () => groupApi.getGroupCompleteViewById(id),
    enabled: !!id,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useGroup = (id?: string) => {
  const { state } = useAuth();
  const user = state.user;

  const queryKey = user ? [`${GROUPS_KEY}-${user.id}`] : [GROUPS_KEY];

  return useQuery({
    queryKey,
    queryFn: () => groupApi.getGroupById(id),
    enabled: !!id,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const { state } = useAuth();
  const user = state.user;

  const groupsKey = user ? [`${GROUPS_KEY}-${user.id}`] : [GROUPS_KEY];

  return useMutation({
    mutationFn: (payload: CreateGroupDto) => groupApi.createGroup(payload),
    onSuccess: (data) => {
      // Invalidate groups list to refetch
      const organizationId = data.organizationId;
      const organizationFullViewQueryKey = user
        ? [organizationId, `${GROUPS_KEY}-${user.id}`]
        : [organizationId, GROUPS_KEY];
      queryClient.invalidateQueries({ queryKey: groupsKey });
      queryClient.invalidateQueries({ queryKey: organizationFullViewQueryKey });
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  const { state } = useAuth();
  const user = state.user;

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGroupDto }) =>
      groupApi.updateGroup(id, payload),
    onSuccess: (_, variables) => {
      // Invalidate specific group and groups list
      const groupKey = user
        ? [`${GROUP_KEY}-${user.id}-${variables.id}`]
        : [`${GROUP_KEY}-${variables.id}`];
      const groupsKey = user ? [`${GROUPS_KEY}-${user.id}`] : [GROUPS_KEY];

      queryClient.invalidateQueries({ queryKey: groupKey });
      queryClient.invalidateQueries({ queryKey: groupsKey });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  const { state } = useAuth();
  const user = state.user;
  const groupsKey = user ? [`${GROUPS_KEY}-${user.id}`] : [GROUPS_KEY];

  return useMutation({
    mutationFn: (id: string) => groupApi.deleteGroup(id),
    onSuccess: () => {
      // Invalidate groups list to refetch
      queryClient.invalidateQueries({ queryKey: groupsKey });
    },
  });
};
