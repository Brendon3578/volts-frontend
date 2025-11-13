import api from "../client";
import type {
  GroupDto,
  CreateGroupDto,
  UpdateGroupDto,
  GroupCompleteViewDto,
  GroupMemberDto,
} from "../types/group";

export const getGroups = async (): Promise<GroupDto[]> => {
  const response = await api.get("/Groups");
  return response.data;
};

export const getGroupById = async (id: string): Promise<GroupDto> => {
  const response = await api.get(`/Groups/${id}`);
  return response.data;
};

export const getGroupCompleteViewById = async (
  id: string
): Promise<GroupCompleteViewDto> => {
  const response = await api.get(`/Groups/${id}/completeView`);

  return response.data;
};

export const getGroupsCompleteViewByOrganizationId = async (
  organizationId?: string
): Promise<GroupCompleteViewDto[]> => {
  const response = await api.get(
    `/Organizations/${organizationId}/Groups/completeView`
  );

  console.log(response);

  return response.data;
};

export const createGroup = async (
  payload: CreateGroupDto
): Promise<GroupDto> => {
  const response = await api.post("/Groups", payload);
  return response.data;
};

export const updateGroup = async (
  id: string,
  payload: UpdateGroupDto
): Promise<GroupDto> => {
  const response = await api.put(`/Groups/${id}`, payload);
  return response.data;
};

export const deleteGroup = async (id: string): Promise<void> => {
  await api.delete(`/Groups/${id}`);
};

export const joinGroup = async (id: string): Promise<void> => {
  await api.post(`/Groups/${id}/join`);
};

export const leaveGroup = async (id: string): Promise<void> => {
  await api.post(`/Groups/${id}/leave`);
};

// member

export const getGroupMembers = async (
  groupId?: string
): Promise<GroupMemberDto[]> => {
  const response = await api.get(`/Groups/${groupId}/members`);
  return response.data;
};
