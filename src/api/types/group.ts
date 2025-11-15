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
  upcomingShiftsCount?: number;
  totalShiftsCount?: number;

  color?: string;
  imageUrl?: string;
  icon?: string;
}
