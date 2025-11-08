import type { Group, Organization } from "../../models";
import type {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  UserOrganization,
} from "../../models/organization";
import api from "../client";

/**
 * GET /api/User/organizations
 * Retorna as organizações e grupos do usuário autenticado
 */
export const getUserOrganizations = async (): Promise<UserOrganization[]> => {
  const response = await api.get("/User/organizations");

  return response.data;
};

/**
 * GET /api/Organizations
 * Retorna todas as organizações disponíveis (público)
 */
export const getAvailableOrganizations = async (): Promise<Organization[]> => {
  const response = await api.get("/Organizations/available");
  return response.data;
};

/**
 * GET /api/Organizations/{id}
 */
export const getOrganizationById = async (
  id: string
): Promise<Organization> => {
  const { data } = await api.get(`/Organizations/${id}`);
  return data;
};

/**
 * GET /api/Organizations/{id}/groups
 */
export const getGroupsByOrganizationId = async (
  id: string
): Promise<Group[]> => {
  const { data } = await api.get(`/Organizations/${id}/groups`);
  return data;
};

/**
 * GET /api/Organizations/creator/{creatorId}
 * Requer autenticação
 */
export const getOrganizationsByCreator = async (
  creatorId: string
): Promise<Organization[]> => {
  const { data } = await api.get(`/Organizations/creator/${creatorId}`);

  return data;
};

/**
 * GET /api/Organizations/me
 * Retorna as organizações do usuário logado
 */
export const getMyOrganizations = async (): Promise<Organization[]> => {
  const { data } = await api.get("/Organizations/me");
  return data;
};

/**
 * POST /api/Organizations
 */
export const createOrganization = async (
  payload: CreateOrganizationDto
): Promise<Organization> => {
  const { data } = await api.post("/Organizations", payload);

  return data;
};

/**
 * PUT /api/Organizations/{id}
 */
export const updateOrganization = async (
  id: string,
  payload: UpdateOrganizationDto
): Promise<Organization> => {
  const { data } = await api.put(`/Organizations/${id}`, payload);

  return data;
};

/**
 * DELETE /api/Organizations/{id}
 */
export const deleteOrganization = async (id: string): Promise<void> => {
  await api.delete(`/Organizations/${id}`);
};

/**
 * POST /api/Organizations/{id}/join
 */
export const joinOrganization = async (id: string): Promise<void> => {
  await api.post(`/Organizations/${id}/join`);
};

/**
 * POST /api/Organizations/{id}/leave
 */
export const leaveOrganization = async (id: string): Promise<void> => {
  await api.post(`/Organizations/${id}/leave`);
};
