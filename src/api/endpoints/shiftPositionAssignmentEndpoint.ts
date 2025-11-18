import api from "../client";
import type {
  ShiftPositionAssignmentDto,
  CreateShiftPositionAssignmentDto,
} from "../../models/shiftPositionAssignment";

export const getAssignmentsByShiftId = async (
  shiftId: string
): Promise<ShiftPositionAssignmentDto[]> => {
  const { data } = await api.get(`/Shifts/shifts/${shiftId}/assignments`);
  return data;
};

export const getAssignmentsByShiftPositionId = async (
  shiftPositionId: string
): Promise<ShiftPositionAssignmentDto[]> => {
  const { data } = await api.get(
    `/Shifts/shift-positions/${shiftPositionId}/assignments`
  );
  return data;
};

export const getAssignmentById = async (
  id: string
): Promise<ShiftPositionAssignmentDto> => {
  const { data } = await api.get(`/Shifts/assignments/${id}`);
  return data;
};

export const applyToShiftPosition = async (
  shiftPositionId: string,
  payload: CreateShiftPositionAssignmentDto
): Promise<ShiftPositionAssignmentDto> => {
  const { data } = await api.post(
    `/Shifts/shift-positions/${shiftPositionId}/apply`,
    payload
  );
  return data;
};

export const confirmAssignment = async (
  id: string
): Promise<ShiftPositionAssignmentDto> => {
  const { data } = await api.put(`/Shifts/assignments/${id}/confirm`);
  return data;
};

export const cancelAssignment = async (
  id: string
): Promise<ShiftPositionAssignmentDto> => {
  const { data } = await api.put(`/Shifts/assignments/${id}/cancel`);
  return data;
};

export const deleteAssignment = async (id: string): Promise<void> => {
  const { data } = await api.delete(`/Shifts/assignments/${id}`);
  return data;
};
