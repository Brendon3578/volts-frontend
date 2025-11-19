import type { VolunteerStatusType } from "./types";

export interface ShiftVolunteerDto {
  id: string;
  userName: string;
  userEmail: string;
  userId: string;
  notes?: string;
  status: VolunteerStatusType;
}

export interface ShiftPositionCompleteViewDto {
  id: string;
  positionId: string;
  positionName: string;
  positionDescription: string;
  requiredCount: number;
  volunteersCount: number;
  volunteers: ShiftVolunteerDto[];
}

export interface ShiftCompleteViewDto {
  id: string;
  title?: string;
  notes?: string;
  startDate: string;
  endDate: string;
  status: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  positions: ShiftPositionCompleteViewDto[];
}
