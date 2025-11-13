import type {
  CreateShiftDto,
  UpdateShiftDto,
  ShiftDto,
} from "../../models/shift";
import api from "../client";

/**
 * GET /api/Shifts/groups/{id}/shifts
 * Retorna todos os turnos de um grupo
 */
export const getShiftsByGroupId = async (
  groupId: string
): Promise<ShiftDto[]> => {
  const { data } = await api.get(`/Shifts/groups/${groupId}/shifts`);
  return data;
};

/**
 * GET /api/Shifts/{id}
 * Retorna um turno específico
 */
export const getShiftById = async (id: string): Promise<ShiftDto> => {
  const { data } = await api.get(`/Shifts/${id}`);
  return data;
};

/**
 * POST /api/Shifts
 * Cria um novo turno
 */
export const createShift = async (
  payload: CreateShiftDto
): Promise<ShiftDto> => {
  const { data } = await api.post("/Shifts", payload);
  return data;
};

/**
 * PUT /api/Shifts/{id}
 * Atualiza um turno
 */
export const updateShift = async (
  id: string,
  payload: UpdateShiftDto
): Promise<ShiftDto> => {
  const { data } = await api.put(`/Shifts/${id}`, payload);
  return data;
};

/**
 * DELETE /api/Shifts/{id}
 * Remove um turno
 */
export const deleteShift = async (id: string): Promise<void> => {
  await api.delete(`/Shifts/${id}`);
};
