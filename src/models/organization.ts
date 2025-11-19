export interface OrganizationFullViewDto {
  id: string;
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  createdById: string; // Quem criou (automaticamente OWNER)

  membersCount: string;
  currentUserOrganizationRole: string;
}

// Tipos para a resposta da API de organizações do usuário
export interface UserGroup {
  groupId: string;
  groupName: string;
  groupDescription: string;
  groupIcon?: string;
  groupColor?: string;
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
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface OrganizationCompleteViewDto {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  isCurrentUserJoined: boolean;
  memberCount: number;
  currentUserOrganizationRole: string;
}

export interface OrganizationMemberDto {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  joinedAt: string;
  userName: string;
  userEmail: string;
}

export interface ChangeOrganizationMemberRoleDto {
  role: string;
}
export interface InviteOrganizationMemberDto {
  invitedEmail: string;
  inviterRole: string;
}
export interface OrganizationUserRoleDto {
  userId: string;
  role: string;
}
