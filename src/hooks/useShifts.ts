import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createShift,
  deleteShift,
  getShiftById,
  getShiftsByGroupId,
  updateShift,
  getShiftCompleteView,
} from "../api/endpoints";
import type { CreateShiftDto, UpdateShiftDto } from "../models/shift";
import { DEFAULT_REACT_QUERY_STALE_TIME } from "../utils";

/**
 * Lista todos os turnos de um grupo
 */
export const useShiftsByGroupId = (groupId?: string) =>
  useQuery({
    queryKey: ["shifts", groupId],
    queryFn: ({ queryKey }) => getShiftsByGroupId(queryKey[1] as string),
    enabled: !!groupId,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
    retry: 1,
  });

/**
 * Busca um turno específico
 */
export const useShiftById = (shiftId?: string) =>
  useQuery({
    queryKey: ["shift", shiftId],
    queryFn: ({ queryKey }) => getShiftById(queryKey[1] as string),
    enabled: !!shiftId,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
  });

export const useShiftCompleteView = (shiftId?: string) =>
  useQuery({
    queryKey: ["shift-complete-view", shiftId],
    queryFn: ({ queryKey }) => getShiftCompleteView(queryKey[1] as string),
    enabled: !!shiftId,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
    retry: 1,
  });

/**
 * Cria um novo turno
 */
export const useCreateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShiftDto) => createShift(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shifts", variables.groupId],
      });
    },
  });
};

/**
 * Atualiza um turno existente
 */
export const useUpdateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateShiftDto;
      groupId?: string;
    }) => updateShift(id, payload),
    onSuccess: (_, { id, groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["shift", id] });
      queryClient.invalidateQueries({
        queryKey: ["shift-complete-view", id],
      });
      if (groupId) {
        queryClient.invalidateQueries({ queryKey: ["shifts", groupId] });
      }
    },
  });
};

/**
 * Deleta um turno
 */
export const useDeleteShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteShift(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["shift", id] });
      queryClient.invalidateQueries({ queryKey: ["shift-complete-view", id] });
    },
  });
};
