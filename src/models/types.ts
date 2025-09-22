/**
 * Type definitions mapping to Prisma schema
 * These types represent the core entities of the volunteer management system
 */

import type {
  OrganizationRole,
  GroupRole,
  ShiftStatus,
  VolunteerStatus,
} from "./constants";

export type OrganizationRoleType =
  (typeof OrganizationRole)[keyof typeof OrganizationRole];

export type GroupRoleType = (typeof GroupRole)[keyof typeof GroupRole];

export type ShiftStatusType = (typeof ShiftStatus)[keyof typeof ShiftStatus];

export type VolunteerStatusType =
  (typeof VolunteerStatus)[keyof typeof VolunteerStatus];

// Core entity types
export interface Organization {
  id: string;
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
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
  user?: User;
  shiftPosition?: ShiftPosition;
}

// UI-specific types
export interface GroupWithDetails extends Group {
  positions: Position[];
  members: GroupUser[];
  upcomingShifts: Shift[];
}

export interface ShiftWithDetails extends Shift {
  positions: (ShiftPosition & {
    position: Position;
    volunteers: (ShiftVolunteer & { user: User })[];
  })[];
}

// Form types for validation
export interface CreateGroupForm {
  name: string;
  description?: string;
}

export interface CreatePositionForm {
  name: string;
  description?: string;
  groupId: string;
}

export interface CreateShiftForm {
  title?: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  groupId: string;
  positions: {
    positionId: string;
    requiredCount: number;
  }[];
}

export interface SignupForm {
  notes?: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Dashboard summary type
export interface DashboardSummary {
  totalGroups: number;
  totalUpcomingShifts: number;
  myUpcomingShifts: number;
  pendingSignups: number;
}
