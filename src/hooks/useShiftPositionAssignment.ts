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
      shiftId?: string;
    }) => applyToShiftPosition(shiftPositionId, payload),
    onSuccess: (assignment, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assignmentsByShiftPosition", variables.shiftPositionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignment", assignment.id],
      });
      if (variables.shiftId) {
        console.log("tem que invalidar");
        queryClient.invalidateQueries({
          queryKey: ["shift-complete-view", variables.shiftId],
        });
        queryClient.invalidateQueries({
          queryKey: ["shift", variables.shiftId],
        });
      }
    },
  });
};

export const useConfirmAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; shiftId?: string }) =>
      confirmAssignment(id),
    onSuccess: (assignment, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assignmentsByShiftPosition", assignment.shiftPositionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignment", assignment.id],
      });
      if (variables.shiftId) {
        queryClient.invalidateQueries({
          queryKey: ["shift-complete-view", variables.shiftId],
        });
        queryClient.invalidateQueries({
          queryKey: ["shift", variables.shiftId],
        });
      }
    },
  });
};

export const useCancelAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; shiftId?: string }) =>
      cancelAssignment(id),
    onSuccess: (assignment, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assignmentsByShiftPosition", assignment.shiftPositionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignment", assignment.id],
      });
      if (variables.shiftId) {
        queryClient.invalidateQueries({
          queryKey: ["shift-complete-view", variables.shiftId],
        });
        queryClient.invalidateQueries({
          queryKey: ["shift", variables.shiftId],
        });
      }
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; shiftId?: string }) =>
      deleteAssignment(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assignment", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["assignmentsByShift"] });
      queryClient.invalidateQueries({
        queryKey: ["assignmentsByShiftPosition"],
      });
      if (variables.shiftId) {
        queryClient.invalidateQueries({
          queryKey: ["shift-complete-view", variables.shiftId],
        });
        queryClient.invalidateQueries({
          queryKey: ["shift", variables.shiftId],
        });
      }
    },
  });
};
