/**
 * Data Adapter Interface
 * This interface defines the contract for data access operations.
 * Implementations can use localStorage, API calls, or any other data source.
 */

import type {
  Group,
  GroupWithDetails,
  Position,
  Shift,
  ShiftWithDetails,
  ShiftPosition,
  ShiftVolunteer,
  User,
  GroupUser,
  CreateGroupForm,
  CreatePositionForm,
  CreateShiftForm,
  SignupForm,
  DashboardSummary,
  VolunteerStatus,
  ShiftStatus,
} from "../../models/types";

export interface IDataAdapter {
  // Dashboard
  getDashboardSummary(): Promise<DashboardSummary>;

  // Groups
  getGroups(): Promise<Group[]>;
  getGroupById(id: string): Promise<GroupWithDetails | null>;
  createGroup(data: CreateGroupForm): Promise<Group>;
  updateGroup(id: string, data: Partial<CreateGroupForm>): Promise<Group>;
  deleteGroup(id: string): Promise<void>;

  // Group Members
  getGroupMembers(groupId: string): Promise<GroupUser[]>;
  joinGroup(groupId: string, userId?: string): Promise<GroupUser>;
  leaveGroup(groupId: string, userId?: string): Promise<void>;

  // Positions
  getPositionsByGroup(groupId: string): Promise<Position[]>;
  createPosition(data: CreatePositionForm): Promise<Position>;
  updatePosition(
    id: string,
    data: Partial<CreatePositionForm>
  ): Promise<Position>;
  deletePosition(id: string): Promise<void>;

  // Shifts
  getShiftsByGroup(groupId: string): Promise<Shift[]>;
  getShiftById(id: string): Promise<ShiftWithDetails | null>;
  createShift(data: CreateShiftForm): Promise<Shift>;
  updateShift(id: string, data: Partial<CreateShiftForm>): Promise<Shift>;
  deleteShift(id: string): Promise<void>;
  updateShiftStatus(id: string, status: ShiftStatus): Promise<Shift>;

  // Shift Volunteering
  signupForShift(
    shiftPositionId: string,
    data: SignupForm,
    userId?: string
  ): Promise<ShiftVolunteer>;

  cancelSignup(shiftVolunteerId: string, userId?: string): Promise<void>;

  updateVolunteerStatus(
    shiftVolunteerId: string,
    status: VolunteerStatus
  ): Promise<ShiftVolunteer>;

  getMySignups(userId?: string): Promise<
    (ShiftVolunteer & {
      shiftPosition: ShiftPosition & {
        shift: Shift;
        position: Position;
      };
    })[]
  >;

  // Users (simplified for demo)
  getCurrentUser(): Promise<User | null>;

  createUser(data: {
    name: string;
    email: string;
    phone?: string;
  }): Promise<User>;

  updateUser(id: string, data: Partial<User>): Promise<User>;
}
