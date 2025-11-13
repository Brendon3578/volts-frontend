import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPosition,
  deletePosition,
  getPositionById,
  getPositionsByGroupId,
  updatePosition,
} from "../api/endpoints";
import type { CreatePositionDto, UpdatePositionDto } from "../models/position";

/**
 * Lista todas as posições de um grupo
 */
export const usePositionsByGroupId = (groupId?: string) =>
  useQuery({
    queryKey: ["positions", groupId],
    queryFn: ({ queryKey }) => getPositionsByGroupId(queryKey[1] as string),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
    retry: 1,
  });

/**
 * Busca uma posição específica
 */
export const usePositionById = (positionId?: string) =>
  useQuery({
    queryKey: ["position", positionId],
    queryFn: ({ queryKey }) => getPositionById(queryKey[1] as string),
    enabled: !!positionId,
    staleTime: 1000 * 60 * 5,
  });

/**
 * Cria uma nova posição
 */
export const useCreatePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePositionDto) => createPosition(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["positions", variables.groupId],
      });
    },
  });
};

/**
 * Atualiza uma posição existente
 */
export const useUpdatePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePositionDto }) =>
      updatePosition(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["positions", variables.payload.groupId],
      });
    },
  });
};

/**
 * Deleta uma posição
 */
export const useDeletePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePosition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });
};
