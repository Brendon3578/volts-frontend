import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrganization,
  deleteOrganization,
  getAvailableOrganizations,
  getUserOrganizations,
  joinOrganization,
  leaveOrganization,
  updateOrganization,
} from "../../api/endpoints";
import type {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from "../../models/organization";

/**
 * Lista todas as organizações disponíveis
 */
export const useAvailableOrganizations = () =>
  useQuery({
    queryKey: ["availableOrganizations"],
    queryFn: getAvailableOrganizations,
    staleTime: 1000 * 60 * 5, // 5 min de cache
  });

/**
 * Lista as organizações do usuário autenticado
 */
export const useUserOrganizations = (userId?: string) =>
  useQuery({
    queryKey: ["userOrganizations", userId],
    queryFn: getUserOrganizations,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userOrganizations"] });
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
    },
  });
};
