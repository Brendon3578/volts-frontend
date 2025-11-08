// Tipos para a resposta da API de organizações do usuário
export interface UserGroup {
  groupId: string;
  groupName: string;
  groupDescription: string;
  memberId: string;
  memberName: string;
  memberRole: string;
}

export interface UserOrganization {
  organizationId: string;
  organizationName: string;
  organizationDescription: string;
  organizationUserRole: string;
  groups: UserGroup[];
}

export interface CreateOrganizationDto {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
}
