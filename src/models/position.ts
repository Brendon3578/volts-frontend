// models/position.ts
export interface PositionDto {
  id: string;
  name: string;
  description?: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePositionDto {
  name: string;
  description?: string;
  groupId: string;
}

export interface UpdatePositionDto {
  groupId: string;
  name?: string;
  description?: string;
}
