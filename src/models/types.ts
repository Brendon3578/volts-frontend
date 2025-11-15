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
import type { Position, ShiftPosition, ShiftVolunteer, User } from "./models";

export type OrganizationRoleType =
  (typeof OrganizationRole)[keyof typeof OrganizationRole];

export type ShiftStatusType = (typeof ShiftStatus)[keyof typeof ShiftStatus];

export type VolunteerStatusType =
  (typeof VolunteerStatus)[keyof typeof VolunteerStatus];

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
