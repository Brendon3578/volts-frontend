import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  applyToShiftPosition,
  cancelAssignment,
  confirmAssignment,
  deleteAssignment,
  getAssignmentById,
  getAssignmentsByShiftId,
  getAssignmentsByShiftPositionId,
} from "../api/endpoints/shiftPositionAssignmentEndpoint";
import type { CreateShiftPositionAssignmentDto } from "../models/shiftPositionAssignment";
import { DEFAULT_REACT_QUERY_STALE_TIME } from "../utils";

export const useAssignmentsByShiftId = (shiftId?: string) =>
  useQuery({
    queryKey: ["assignmentsByShift", shiftId],
    queryFn: ({ queryKey }) => getAssignmentsByShiftId(queryKey[1] as string),
    enabled: !!shiftId,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
    retry: 1,
  });

export const useAssignmentsByShiftPositionId = (shiftPositionId?: string) =>
  useQuery({
    queryKey: ["assignmentsByShiftPosition", shiftPositionId],
    queryFn: ({ queryKey }) =>
      getAssignmentsByShiftPositionId(queryKey[1] as string),
    enabled: !!shiftPositionId,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
    retry: 1,
  });

export const useAssignmentById = (id?: string) =>
  useQuery({
    queryKey: ["assignment", id],
    queryFn: ({ queryKey }) => getAssignmentById(queryKey[1] as string),
    enabled: !!id,
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
  });

export const useApplyToShiftPosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shiftPositionId,
      payload,
    }: {
      shiftPositionId: string;
      payload: CreateShiftPositionAssignmentDto;
    }) => applyToShiftPosition(shiftPositionId, payload),
    onSuccess: (assignment, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assignmentsByShiftPosition", variables.shiftPositionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignment", assignment.id],
      });
    },
  });
};

export const useConfirmAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => confirmAssignment(id),
    onSuccess: (assignment) => {
      queryClient.invalidateQueries({
        queryKey: ["assignmentsByShiftPosition", assignment.shiftPositionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignment", assignment.id],
      });
    },
  });
};

export const useCancelAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => cancelAssignment(id),
    onSuccess: (assignment) => {
      queryClient.invalidateQueries({
        queryKey: ["assignmentsByShiftPosition", assignment.shiftPositionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignment", assignment.id],
      });
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteAssignment(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assignment", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["assignmentsByShift"] });
      queryClient.invalidateQueries({
        queryKey: ["assignmentsByShiftPosition"],
      });
    },
  });
};
