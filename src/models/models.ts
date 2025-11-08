import type {
  ShiftStatusType,
  OrganizationRoleType,
  GroupRoleType,
  VolunteerStatusType,
} from "./types";

// Core entity types
export interface Organization {
  id: string;
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  createdById: string; // Quem criou (automaticamente OWNER)
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: OrganizationRoleType;
  joinedAt: Date;
  invitedById?: string; // Quem convidou

  // Relacionamentos populados
  user?: User;
  organization?: Organization;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
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
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: GroupRoleType;
  joinedAt: Date;
  addedById?: string; // Quem adicionou

  // Relacionamentos populados
  user?: User;
  group?: Group;
}

export interface Position {
  id: string;
  name: string;
  description?: string;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shift {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  title?: string;
  notes?: string;
  status: ShiftStatusType;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
  // Computed fields for UI
  totalVolunteersNeeded?: number;
  confirmedVolunteers?: number;
  group?: Group;
}

// Junction table types
export interface OrganizationUser {
  id: string;
  userId: string;
  organizationId: string;
  role: OrganizationRoleType;
  joinedAt: Date;
}

export interface GroupUser {
  id: string;
  userId: string;
  groupId: string;
  role: GroupRoleType;
  joinedAt: Date;
  user?: User;
  group?: Group;
}

export interface ShiftPosition {
  id: string;
  shiftId: string;
  positionId: string;
  requiredCount: number;
  volunteersCount: number;
  position?: Position;
  volunteers?: ShiftVolunteer[];
}

export interface ShiftVolunteer {
  id: string;
  userId: string;
  shiftPositionId: string;
  status: VolunteerStatusType;
  notes?: string;
  appliedAt: Date;
  confirmedAt?: Date;
  updatedAt: Date;
  rejectedAt?: Date;
  user?: User;
  shiftPosition?: ShiftPosition;
}
