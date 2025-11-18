import type { VolunteerStatusType } from "./types";

export interface ShiftPositionAssignmentDto {
  id: string;
  userId: string;
  userName: string;
  shiftPositionId: string;
  positionName: string;
  status: VolunteerStatusType;
  notes?: string;
  appliedAt: string;
  confirmedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShiftPositionAssignmentDto {
  notes?: string;
}
