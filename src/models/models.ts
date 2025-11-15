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

export interface Position {
  id: string;
  name: string;
  description?: string;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Junction table types
export interface OrganizationUser {
  id: string;
  userId: string;
  organizationId: string;
  role: OrganizationRoleType;
  joinedAt: Date;
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
