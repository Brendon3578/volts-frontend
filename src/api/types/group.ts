import { type GroupRoleType } from "../../models";

export interface GroupDto {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdById: string;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupDto {
  name: string;
  description?: string;
  organizationId: string;
  color?: string;
  icon?: string;
}

export interface GroupMemberDto {
  id: string;
  userId: string;
  groupId: string;
  role: string;
  joinedAt: string;
  userName: string;
  userEmail: string;
}

export interface InviteUserGroupDto {
  invitedId: string;
  inviterRole: GroupRoleType;
}

export interface UpdateGroupDto {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  organizationId?: string;
}

export interface GroupCompleteViewDto {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  // Computed fields for UI
  memberCount?: number;
  upcomingShiftsCount?: number;

  color?: string;
  imageUrl?: string;
  icon?: string;

  isCurrentUserJoined: boolean;
}
