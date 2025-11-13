// models/shift.ts

import type { ShiftStatusType } from "./types";

export interface ShiftPositionDto {
  id: string;
  positionId: string;
  requiredCount: number;
  volunteersCount: number;
  positionName: string;
}

export interface CreateShiftPositionDto {
  positionId: string;
  requiredCount: number;
}

export interface ShiftDto {
  id: string;
  startDate: string; // DateTime é string ISO
  endDate: string;
  title?: string;
  notes?: string;
  status: ShiftStatusType;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  positions: ShiftPositionDto[];
}

export interface CreateShiftDto {
  startDate: string;
  endDate: string;
  title?: string;
  notes?: string;
  groupId: string;
  positions: CreateShiftPositionDto[];
}

export interface UpdateShiftDto {
  startDate?: string;
  endDate?: string;
  title?: string;
  notes?: string;
  status?: ShiftStatusType;
  positions?: CreateShiftPositionDto[];
}
