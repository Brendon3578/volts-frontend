import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeOrganizationMemberRole,
  createOrganization,
  deleteOrganization,
  getAvailableOrganizations,
  getOrganizationById,
  getOrganizationCompleteViewById,
  getOrganizationMembers,
  getOrganizationsCompleteView,
  getUserOrganizations,
  joinOrganization,
  leaveOrganization,
  updateOrganization,
  inviteOrganizationMember,
  removeOrganizationMember,
  deleteOrganizationMember,
  getSelfRole,
} from "../api/endpoints";
import type {
  ChangeOrganizationMemberRoleDto,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  InviteOrganizationMemberDto,
  OrganizationUserRoleDto,
} from "../models/organization";
import { useAuth } from "../context/Auth/useAuth";
import { DEFAULT_REACT_QUERY_STALE_TIME } from "../utils";

// todo: centralizar depois as querykey

/**
 * Lista todas as organizações disponíveis
 */
export const useAvailableOrganizations = () => {
  const { state } = useAuth();
  const user = state.user;

  const queryKey = user
    ? [`availableOrganizations-${user?.id}`]
    : ["availableOrganizations"];

  return useQuery({
    queryKey,
    queryFn: getAvailableOrganizations,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME, // 5 min de cache
  });
};
/**
 * Lista as organizações do usuário autenticado
 */
export const useUserOrganizations = (userId?: string) =>
  useQuery({
    queryKey: ["userOrganizations", userId],
    queryFn: getUserOrganizations,
    enabled: !!userId,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
  });

export const useOrganizationById = (orgId?: string) =>
  useQuery({
    queryKey: ["organizations", orgId],
    queryFn: ({ queryKey }) => getOrganizationById(queryKey[1] as string),
    enabled: !!orgId, // só faz a requisição se o id existir
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME, // cache por 5 minutos
    retry: 1, // tenta apenas uma vez em caso de erro
  });

// --------------- MUTATIONS ---------------

/**
 * Cria uma nova organização
 */
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrganizationDto) => createOrganization(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availableOrganizations"] });
      queryClient.invalidateQueries({ queryKey: ["userOrganizations"] });
    },
  });
};

export const useInviteOrganizationMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      payload,
    }: {
      organizationId: string;
      payload: InviteOrganizationMemberDto;
    }) => inviteOrganizationMember(organizationId, payload),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["organizationMembers", organizationId],
      });
    },
  });
};

export const useRemoveOrganizationMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      memberId,
    }: {
      organizationId: string;
      memberId: string;
    }) => removeOrganizationMember(organizationId, memberId),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["organizationMembers", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organizationCompleteView", organizationId],
      });
    },
  });
};

export const useDeleteOrganizationMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      memberId,
    }: {
      organizationId: string;
      memberId: string;
    }) => deleteOrganizationMember(organizationId, memberId),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["organizationMembers", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organizationCompleteView", organizationId],
      });
    },
  });
};

export const useSelfOrganizationRole = (organizationId?: string) =>
  useQuery<OrganizationUserRoleDto>({
    queryKey: ["organization", organizationId, "self-role"],
    queryFn: ({ queryKey }) => getSelfRole(queryKey[1] as string),
    enabled: !!organizationId,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
    retry: 1,
  });

/**
 * Atualiza uma organização
 */
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateOrganizationDto;
    }) => updateOrganization(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["userOrganizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organizationCompleteView", id],
      });
    },
  });
};

/**
 * Deleta uma organização
 */
export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userOrganizations"] });
      queryClient.invalidateQueries({ queryKey: ["availableOrganizations"] });
    },
  });
};

/**
 * Entrar em uma organização
 */
export const useJoinOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => joinOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userOrganizations"] });
      queryClient.invalidateQueries({ queryKey: ["availableOrganizations"] });
    },
  });
};

/**
 * Sair de uma organização
 */
export const useLeaveOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leaveOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userOrganizations"] });
      queryClient.invalidateQueries({ queryKey: ["availableOrganizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organizationsCompleteView"],
      });
    },
  });
};

/**
 * Lista todas as organizações com visualização completa
 */
export const useOrganizationsCompleteView = () =>
  useQuery({
    queryKey: ["organizationsCompleteView"],
    queryFn: getOrganizationsCompleteView,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME, // 5 min de cache
  });

/**
 * Busca a visão completa de uma organização específica
 */
export const useOrganizationCompleteViewById = (id?: string) => {
  const { state } = useAuth();
  const user = state.user;

  const queryKey = user
    ? ["organizationCompleteView", id, `organizationCompleteView-${user?.id}`]
    : ["organizationCompleteView", id];

  return useQuery({
    queryKey,
    queryFn: () => getOrganizationCompleteViewById(id),
    enabled: !!id,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
    retry: 1,
  });
};

/**
 * Lista os membros de uma organização
 */
export const useOrganizationMembers = (organizationId?: string) =>
  useQuery({
    queryKey: ["organizationMembers", organizationId],
    queryFn: ({ queryKey }) => getOrganizationMembers(queryKey[1] as string),
    enabled: !!organizationId,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
  });

// --------------- MUTATIONS ---------------

/**
 * Altera o papel de um membro dentro de uma organização
 */
export const useChangeOrganizationMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      memberId,
      payload,
    }: {
      organizationId: string;
      memberId: string;
      payload: ChangeOrganizationMemberRoleDto;
    }) => changeOrganizationMemberRole(organizationId, memberId, payload),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["organizationMembers", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organizationCompleteView", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "self-role"],
      });
    },
  });
};
