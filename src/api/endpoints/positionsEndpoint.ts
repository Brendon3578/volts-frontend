import type {
  CreatePositionDto,
  UpdatePositionDto,
  PositionDto,
} from "../../models/position";
import api from "../client";

/**
 * GET /api/Positions/groups/{id}/positions
 * Retorna todas as posições de um grupo
 */
export const getPositionsByGroupId = async (
  groupId: string
): Promise<PositionDto[]> => {
  const { data } = await api.get(`/Positions/groups/${groupId}/positions`);
  return data;
};

/**
 * GET /api/Positions/{id}
 * Retorna uma posição pelo ID
 */
export const getPositionById = async (id: string): Promise<PositionDto> => {
  const { data } = await api.get(`/Positions/${id}`);
  return data;
};

/**
 * POST /api/Positions
 * Cria uma nova posição
 */
export const createPosition = async (
  payload: CreatePositionDto
): Promise<PositionDto> => {
  const { data } = await api.post("/Positions", payload);
  return data;
};

/**
 * PUT /api/Positions/{id}
 * Atualiza uma posição
 */
export const updatePosition = async (
  id: string,
  payload: UpdatePositionDto
): Promise<PositionDto> => {
  const { data } = await api.put(`/Positions/${id}`, payload);
  return data;
};

/**
 * DELETE /api/Positions/{id}
 * Remove uma posição
 */
export const deletePosition = async (id: string): Promise<void> => {
  await api.delete(`/Positions/${id}`);
};
