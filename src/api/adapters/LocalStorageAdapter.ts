/**
 * LocalStorage Data Adapter
 * Implements IDataAdapter using browser localStorage for data persistence
 */

import { GroupRole, ShiftStatus, VolunteerStatus } from "../../models";
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
  SignupPositionForm,
  DashboardSummary,
  ShiftStatusType,
  VolunteerStatusType,
} from "../../models";

import type { IDataAdapter } from "./IDataAdapter";

class LocalStorageAdapter implements IDataAdapter {
  private readonly KEYS = {
    GROUPS: "volunteer_groups",
    POSITIONS: "volunteer_positions",
    SHIFTS: "volunteer_shifts",
    SHIFT_POSITIONS: "volunteer_shift_positions",
    SHIFT_VOLUNTEERS: "volunteer_shift_volunteers",
    USERS: "volunteer_users",
    GROUP_USERS: "volunteer_group_users",
    CURRENT_USER: "volunteer_current_user",
  };

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private async delay(ms: number = 100): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getFromStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Initialize with sample data
  private initializeSampleData(): void {
    if (!localStorage.getItem(this.KEYS.USERS)) {
      const sampleUser: User = {
        id: "user-1",
        name: "João Silva",
        email: "joao@exemplo.com",
        phone: "(11) 99999-9999",
        bio: "Voluntário dedicado",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.saveToStorage(this.KEYS.USERS, [sampleUser]);
      localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(sampleUser));
    }

    if (!localStorage.getItem(this.KEYS.GROUPS)) {
      const sampleGroups: Group[] = [
        {
          id: "group-1",
          name: "Ministério de Louvor",
          description: "Equipe responsável pelo louvor nos cultos",
          organizationId: "org-1",
          createdById: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "group-2",
          name: "Plantão de Apoio",
          description: "Suporte geral durante os eventos",
          organizationId: "org-1",
          createdById: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      this.saveToStorage(this.KEYS.GROUPS, sampleGroups);

      const samplePositions: Position[] = [
        {
          id: "pos-1",
          name: "Guitarrista",
          description: "Responsável pela guitarra durante o louvor",
          groupId: "group-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "pos-2",
          name: "Vocalista",
          description: "Vocal principal ou backing vocal",
          groupId: "group-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "pos-3",
          name: "Apoio Geral",
          description: "Suporte durante eventos",
          groupId: "group-2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      this.saveToStorage(this.KEYS.POSITIONS, samplePositions);

      const sampleGroupUsers: GroupUser[] = [
        {
          id: "gu-1",
          userId: "user-1",
          groupId: "group-1",
          role: GroupRole.GROUP_LEADER,
          joinedAt: new Date(),
        },
        {
          id: "gu-2",
          userId: "user-1",
          groupId: "group-2",
          role: GroupRole.VOLUNTEER,
          joinedAt: new Date(),
        },
      ];

      this.saveToStorage(this.KEYS.GROUP_USERS, sampleGroupUsers);
    }
  }

  constructor() {
    this.initializeSampleData();
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    await this.delay();

    const groups = this.getFromStorage<Group>(this.KEYS.GROUPS);
    const shifts = this.getFromStorage<Shift>(this.KEYS.SHIFTS);
    const mySignups = this.getFromStorage<ShiftVolunteer>(
      this.KEYS.SHIFT_VOLUNTEERS
    );
    const currentUser = await this.getCurrentUser();

    const now = new Date();
    const upcomingShifts = shifts.filter(
      (shift) => new Date(shift.date) >= now
    );
    const myUpcomingSignups = mySignups.filter(
      (signup) =>
        signup.userId === currentUser?.id &&
        signup.status === VolunteerStatus.CONFIRMED
    );

    return {
      totalGroups: groups.length,
      totalUpcomingShifts: upcomingShifts.length,
      myUpcomingShifts: myUpcomingSignups.length,
      pendingSignups: mySignups.filter(
        (s) => s.status === VolunteerStatus.PENDING
      ).length,
    };
  }

  async getGroups(): Promise<Group[]> {
    await this.delay();
    const groups = this.getFromStorage<Group>(this.KEYS.GROUPS);
    const shifts = this.getFromStorage<Shift>(this.KEYS.SHIFTS);
    const groupUsers = this.getFromStorage<GroupUser>(this.KEYS.GROUP_USERS);

    return groups.map((group) => ({
      ...group,
      createdAt: new Date(group.createdAt),
      updatedAt: new Date(group.updatedAt),
      memberCount: groupUsers.filter((gu) => gu.groupId === group.id).length,
      upcomingShiftsCount: shifts.filter(
        (shift) =>
          shift.groupId === group.id && new Date(shift.date) >= new Date()
      ).length,
    }));
  }

  async getGroupById(id: string): Promise<GroupWithDetails | null> {
    await this.delay();
    const groups = this.getFromStorage<Group>(this.KEYS.GROUPS);
    const positions = this.getFromStorage<Position>(this.KEYS.POSITIONS);
    const shifts = this.getFromStorage<Shift>(this.KEYS.SHIFTS);
    const groupUsers = this.getFromStorage<GroupUser>(this.KEYS.GROUP_USERS);
    const users = this.getFromStorage<User>(this.KEYS.USERS);

    const group = groups.find((g) => g.id === id);
    if (!group) return null;

    const groupPositions = positions.filter((p) => p.groupId === id);
    const groupMembers = groupUsers
      .filter((gu) => gu.groupId === id)
      .map((gu) => ({
        ...gu,
        joinedAt: new Date(gu.joinedAt),
        user: users.find((u) => u.id === gu.userId),
      }));

    const now = new Date();
    const upcomingShifts = shifts
      .filter((s) => s.groupId === id && new Date(s.date) >= now)
      .map((s) => ({
        ...s,
        date: new Date(s.date),
        startTime: new Date(s.startTime),
        endTime: new Date(s.endTime),
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      ...group,
      createdAt: new Date(group.createdAt),
      updatedAt: new Date(group.updatedAt),
      positions: groupPositions.map((p) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      })),
      members: groupMembers,
      upcomingShifts,
    };
  }

  async createGroup(data: CreateGroupForm): Promise<Group> {
    await this.delay();
    const groups = this.getFromStorage<Group>(this.KEYS.GROUPS);
    const currentUser = await this.getCurrentUser();

    const newGroup: Group = {
      id: this.generateId(),
      name: data.name,
      description: data.description,
      organizationId: "org-1", // Simplified for demo
      createdById: currentUser?.id || "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    groups.push(newGroup);
    this.saveToStorage(this.KEYS.GROUPS, groups);

    // Auto-join creator as group leader
    const groupUsers = this.getFromStorage<GroupUser>(this.KEYS.GROUP_USERS);
    groupUsers.push({
      id: this.generateId(),
      userId: currentUser?.id || "user-1",
      groupId: newGroup.id,
      role: GroupRole.GROUP_LEADER,
      joinedAt: new Date(),
    });
    this.saveToStorage(this.KEYS.GROUP_USERS, groupUsers);

    return newGroup;
  }

  async updateGroup(
    id: string,
    data: Partial<CreateGroupForm>
  ): Promise<Group> {
    await this.delay();
    const groups = this.getFromStorage<Group>(this.KEYS.GROUPS);
    const groupIndex = groups.findIndex((g) => g.id === id);

    if (groupIndex === -1) {
      throw new Error("Grupo não encontrado");
    }

    groups[groupIndex] = {
      ...groups[groupIndex],
      ...data,
      updatedAt: new Date(),
    };

    this.saveToStorage(this.KEYS.GROUPS, groups);
    return groups[groupIndex];
  }

  async deleteGroup(id: string): Promise<void> {
    await this.delay();
    const groups = this.getFromStorage<Group>(this.KEYS.GROUPS);
    const filteredGroups = groups.filter((g) => g.id !== id);
    this.saveToStorage(this.KEYS.GROUPS, filteredGroups);

    // Clean up related data
    const positions = this.getFromStorage<Position>(this.KEYS.POSITIONS);
    const shifts = this.getFromStorage<Shift>(this.KEYS.SHIFTS);
    const groupUsers = this.getFromStorage<GroupUser>(this.KEYS.GROUP_USERS);

    this.saveToStorage(
      this.KEYS.POSITIONS,
      positions.filter((p) => p.groupId !== id)
    );
    this.saveToStorage(
      this.KEYS.SHIFTS,
      shifts.filter((s) => s.groupId !== id)
    );
    this.saveToStorage(
      this.KEYS.GROUP_USERS,
      groupUsers.filter((gu) => gu.groupId !== id)
    );
  }

  async getGroupMembers(groupId: string): Promise<GroupUser[]> {
    await this.delay();
    const groupUsers = this.getFromStorage<GroupUser>(this.KEYS.GROUP_USERS);
    const users = this.getFromStorage<User>(this.KEYS.USERS);

    return groupUsers
      .filter((gu) => gu.groupId === groupId)
      .map((gu) => ({
        ...gu,
        joinedAt: new Date(gu.joinedAt),
        user: users.find((u) => u.id === gu.userId),
      }));
  }

  async joinGroup(groupId: string, userId?: string): Promise<GroupUser> {
    await this.delay();
    const currentUser = await this.getCurrentUser();
    const targetUserId = userId || currentUser?.id;

    if (!targetUserId) {
      throw new Error("Usuário não encontrado");
    }

    const groupUsers = this.getFromStorage<GroupUser>(this.KEYS.GROUP_USERS);

    // Check if already a member
    const existingMembership = groupUsers.find(
      (gu) => gu.groupId === groupId && gu.userId === targetUserId
    );

    if (existingMembership) {
      throw new Error("Usuário já é membro deste grupo");
    }

    const newMembership: GroupUser = {
      id: this.generateId(),
      userId: targetUserId,
      groupId,
      role: GroupRole.VOLUNTEER,
      joinedAt: new Date(),
    };

    groupUsers.push(newMembership);
    this.saveToStorage(this.KEYS.GROUP_USERS, groupUsers);

    return newMembership;
  }

  async leaveGroup(groupId: string, userId?: string): Promise<void> {
    await this.delay();
    const currentUser = await this.getCurrentUser();
    const targetUserId = userId || currentUser?.id;

    const groupUsers = this.getFromStorage<GroupUser>(this.KEYS.GROUP_USERS);
    const filteredGroupUsers = groupUsers.filter(
      (gu) => !(gu.groupId === groupId && gu.userId === targetUserId)
    );

    this.saveToStorage(this.KEYS.GROUP_USERS, filteredGroupUsers);
  }

  async getPositionsByGroup(groupId: string): Promise<Position[]> {
    await this.delay();
    const positions = this.getFromStorage<Position>(this.KEYS.POSITIONS);
    return positions
      .filter((p) => p.groupId === groupId)
      .map((p) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));
  }

  async createPosition(data: CreatePositionForm): Promise<Position> {
    await this.delay();
    const positions = this.getFromStorage<Position>(this.KEYS.POSITIONS);

    const newPosition: Position = {
      id: this.generateId(),
      name: data.name,
      description: data.description,
      groupId: data.groupId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    positions.push(newPosition);
    this.saveToStorage(this.KEYS.POSITIONS, positions);
    return newPosition;
  }

  async updatePosition(
    id: string,
    data: Partial<CreatePositionForm>
  ): Promise<Position> {
    await this.delay();
    const positions = this.getFromStorage<Position>(this.KEYS.POSITIONS);
    const positionIndex = positions.findIndex((p) => p.id === id);

    if (positionIndex === -1) {
      throw new Error("Posição não encontrada");
    }

    positions[positionIndex] = {
      ...positions[positionIndex],
      ...data,
      updatedAt: new Date(),
    };

    this.saveToStorage(this.KEYS.POSITIONS, positions);
    return positions[positionIndex];
  }

  async deletePosition(id: string): Promise<void> {
    await this.delay();
    const positions = this.getFromStorage<Position>(this.KEYS.POSITIONS);
    const filteredPositions = positions.filter((p) => p.id !== id);
    this.saveToStorage(this.KEYS.POSITIONS, filteredPositions);
  }

  async getShiftsByGroup(groupId: string): Promise<Shift[]> {
    await this.delay();
    const shifts = this.getFromStorage<Shift>(this.KEYS.SHIFTS);
    return shifts
      .filter((s) => s.groupId === groupId)
      .map((s) => ({
        ...s,
        date: new Date(s.date),
        startTime: new Date(s.startTime),
        endTime: new Date(s.endTime),
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async getShiftById(id: string): Promise<ShiftWithDetails | null> {
    await this.delay();
    const shifts = this.getFromStorage<Shift>(this.KEYS.SHIFTS);
    const shiftPositions = this.getFromStorage<ShiftPosition>(
      this.KEYS.SHIFT_POSITIONS
    );
    const shiftVolunteers = this.getFromStorage<ShiftVolunteer>(
      this.KEYS.SHIFT_VOLUNTEERS
    );
    const positions = this.getFromStorage<Position>(this.KEYS.POSITIONS);
    const users = this.getFromStorage<User>(this.KEYS.USERS);
    const groups = this.getFromStorage<Group>(this.KEYS.GROUPS);

    const shift = shifts.find((s) => s.id === id);
    if (!shift) return null;

    const shiftPositionsWithDetails = shiftPositions
      .filter((sp) => sp.shiftId === id)
      .map((sp) => {
        const position = positions.find((p) => p.id === sp.positionId);
        const volunteers = shiftVolunteers
          .filter((sv) => sv.shiftPositionId === sp.id)
          .map((sv) => ({
            ...sv,
            appliedAt: new Date(sv.appliedAt),
            confirmedAt: sv.confirmedAt ? new Date(sv.confirmedAt) : undefined,
            updatedAt: new Date(sv.updatedAt),
            user: users.find((u) => u.id === sv.userId)!,
          }));

        return {
          ...sp,
          position: position!,
          volunteers,
        };
      });

    return {
      ...shift,
      date: new Date(shift.date),
      startTime: new Date(shift.startTime),
      endTime: new Date(shift.endTime),
      createdAt: new Date(shift.createdAt),
      updatedAt: new Date(shift.updatedAt),
      group: groups.find((g) => g.id === shift.groupId),
      positions: shiftPositionsWithDetails,
    };
  }

  async createShift(data: CreateShiftForm): Promise<Shift> {
    await this.delay();
    const shifts = this.getFromStorage<Shift>(this.KEYS.SHIFTS);
    const shiftPositions = this.getFromStorage<ShiftPosition>(
      this.KEYS.SHIFT_POSITIONS
    );

    const shiftDate = new Date(data.date);
    const startTime = new Date(`${data.date}T${data.startTime}`);
    const endTime = new Date(`${data.date}T${data.endTime}`);

    const newShift: Shift = {
      id: this.generateId(),
      title: data.title,
      date: shiftDate,
      startTime,
      endTime,
      notes: data.notes,
      status: ShiftStatus.OPEN,
      groupId: data.groupId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    shifts.push(newShift);
    this.saveToStorage(this.KEYS.SHIFTS, shifts);

    // Create shift positions
    const newShiftPositions = data.positions.map((pos) => ({
      id: this.generateId(),
      shiftId: newShift.id,
      positionId: pos.positionId,
      requiredCount: pos.requiredCount,
      volunteersCount: 0,
    }));

    shiftPositions.push(...newShiftPositions);
    this.saveToStorage(this.KEYS.SHIFT_POSITIONS, shiftPositions);

    return newShift;
  }

  async updateShift(
    id: string,
    data: Partial<CreateShiftForm>
  ): Promise<Shift> {
    await this.delay();
    const shifts = this.getFromStorage<Shift>(this.KEYS.SHIFTS);
    const shiftIndex = shifts.findIndex((s) => s.id === id);

    if (shiftIndex === -1) {
      throw new Error("Escala não encontrada");
    }

    const updateData: Partial<CreateShiftForm> = { ...data };

    let date: Date = shifts[shiftIndex].date;
    let startTime: Date = shifts[shiftIndex].startTime;
    let endTime: Date = shifts[shiftIndex].endTime;

    if (data.date) {
      date = new Date(data.date);
    }
    if (data.startTime && data.date) {
      startTime = new Date(`${data.date}T${data.startTime}`);
    } else if (data.startTime) {
      startTime = new Date(data.startTime);
    }
    if (data.endTime && data.date) {
      endTime = new Date(`${data.date}T${data.endTime}`);
    } else if (data.endTime) {
      endTime = new Date(data.endTime);
    }

    shifts[shiftIndex] = {
      ...shifts[shiftIndex],
      ...updateData,
      date,
      startTime,
      endTime,
      updatedAt: new Date(),
    };

    this.saveToStorage(this.KEYS.SHIFTS, shifts);
    return shifts[shiftIndex];
  }

  async deleteShift(id: string): Promise<void> {
    await this.delay();
    const shifts = this.getFromStorage<Shift>(this.KEYS.SHIFTS);
    const shiftPositions = this.getFromStorage<ShiftPosition>(
      this.KEYS.SHIFT_POSITIONS
    );
    const shiftVolunteers = this.getFromStorage<ShiftVolunteer>(
      this.KEYS.SHIFT_VOLUNTEERS
    );

    this.saveToStorage(
      this.KEYS.SHIFTS,
      shifts.filter((s) => s.id !== id)
    );

    // Clean up related data
    const positionsToDelete = shiftPositions.filter((sp) => sp.shiftId === id);
    const positionIds = positionsToDelete.map((sp) => sp.id);

    this.saveToStorage(
      this.KEYS.SHIFT_POSITIONS,
      shiftPositions.filter((sp) => sp.shiftId !== id)
    );
    this.saveToStorage(
      this.KEYS.SHIFT_VOLUNTEERS,
      shiftVolunteers.filter((sv) => !positionIds.includes(sv.shiftPositionId))
    );
  }

  async updateShiftStatus(id: string, status: ShiftStatusType): Promise<Shift> {
    await this.delay();
    const shifts = this.getFromStorage<Shift>(this.KEYS.SHIFTS);
    const shiftIndex = shifts.findIndex((s) => s.id === id);

    if (shiftIndex === -1) {
      throw new Error("Escala não encontrada");
    }

    shifts[shiftIndex] = {
      ...shifts[shiftIndex],
      status,
      updatedAt: new Date(),
    };

    this.saveToStorage(this.KEYS.SHIFTS, shifts);
    return shifts[shiftIndex];
  }

  async signupForShift(
    shiftPositionId: string,
    data: SignupPositionForm,
    userId?: string
  ): Promise<ShiftVolunteer> {
    await this.delay();
    const currentUser = await this.getCurrentUser();
    const targetUserId = userId || currentUser?.id;

    if (!targetUserId) {
      throw new Error("Usuário não encontrado");
    }

    const shiftVolunteers = this.getFromStorage<ShiftVolunteer>(
      this.KEYS.SHIFT_VOLUNTEERS
    );
    const shiftPositions = this.getFromStorage<ShiftPosition>(
      this.KEYS.SHIFT_POSITIONS
    );

    // Check if already signed up
    const existingSignup = shiftVolunteers.find(
      (sv) =>
        sv.shiftPositionId === shiftPositionId && sv.userId === targetUserId
    );

    if (existingSignup) {
      throw new Error("Você já está inscrito nesta posição");
    }

    const newSignup: ShiftVolunteer = {
      id: this.generateId(),
      userId: targetUserId,
      shiftPositionId,
      status: VolunteerStatus.PENDING,
      notes: data.notes,
      appliedAt: new Date(),
      updatedAt: new Date(),
    };

    shiftVolunteers.push(newSignup);
    this.saveToStorage(this.KEYS.SHIFT_VOLUNTEERS, shiftVolunteers);

    // Update volunteers count
    const positionIndex = shiftPositions.findIndex(
      (sp) => sp.id === shiftPositionId
    );
    if (positionIndex !== -1) {
      shiftPositions[positionIndex].volunteersCount++;
      this.saveToStorage(this.KEYS.SHIFT_POSITIONS, shiftPositions);
    }

    return newSignup;
  }

  async cancelSignup(shiftVolunteerId: string, userId?: string): Promise<void> {
    await this.delay();

    console.log(userId);

    const shiftVolunteers = this.getFromStorage<ShiftVolunteer>(
      this.KEYS.SHIFT_VOLUNTEERS
    );
    const shiftPositions = this.getFromStorage<ShiftPosition>(
      this.KEYS.SHIFT_POSITIONS
    );

    const signupIndex = shiftVolunteers.findIndex(
      (sv) => sv.id === shiftVolunteerId
    );
    if (signupIndex === -1) {
      throw new Error("Inscrição não encontrada");
    }

    const signup = shiftVolunteers[signupIndex];

    // Update volunteers count
    const positionIndex = shiftPositions.findIndex(
      (sp) => sp.id === signup.shiftPositionId
    );
    if (positionIndex !== -1) {
      shiftPositions[positionIndex].volunteersCount--;
      this.saveToStorage(this.KEYS.SHIFT_POSITIONS, shiftPositions);
    }

    shiftVolunteers.splice(signupIndex, 1);
    this.saveToStorage(this.KEYS.SHIFT_VOLUNTEERS, shiftVolunteers);
  }

  async updateVolunteerStatus(
    shiftVolunteerId: string,
    status: VolunteerStatusType
  ): Promise<ShiftVolunteer> {
    await this.delay();
    const shiftVolunteers = this.getFromStorage<ShiftVolunteer>(
      this.KEYS.SHIFT_VOLUNTEERS
    );
    const volunteerIndex = shiftVolunteers.findIndex(
      (sv) => sv.id === shiftVolunteerId
    );

    if (volunteerIndex === -1) {
      throw new Error("Voluntário não encontrado");
    }

    const updateData: Partial<ShiftVolunteer> = {
      status,
      updatedAt: new Date(),
    };

    if (
      status === VolunteerStatus.CONFIRMED &&
      !shiftVolunteers[volunteerIndex].confirmedAt
    ) {
      updateData.confirmedAt = new Date();
    }

    shiftVolunteers[volunteerIndex] = {
      ...shiftVolunteers[volunteerIndex],
      ...updateData,
    };

    this.saveToStorage(this.KEYS.SHIFT_VOLUNTEERS, shiftVolunteers);
    return shiftVolunteers[volunteerIndex];
  }

  async getMySignups(userId?: string): Promise<
    (ShiftVolunteer & {
      shiftPosition: ShiftPosition & {
        shift: Shift;
        position: Position;
      };
    })[]
  > {
    await this.delay();
    const currentUser = await this.getCurrentUser();
    const targetUserId = userId || currentUser?.id;

    if (!targetUserId) return [];

    const shiftVolunteers = this.getFromStorage<ShiftVolunteer>(
      this.KEYS.SHIFT_VOLUNTEERS
    );
    const shiftPositions = this.getFromStorage<ShiftPosition>(
      this.KEYS.SHIFT_POSITIONS
    );
    const shifts = this.getFromStorage<Shift>(this.KEYS.SHIFTS);
    const positions = this.getFromStorage<Position>(this.KEYS.POSITIONS);

    return shiftVolunteers
      .filter((sv) => sv.userId === targetUserId)
      .map((sv) => {
        const shiftPosition = shiftPositions.find(
          (sp) => sp.id === sv.shiftPositionId
        )!;
        const shift = shifts.find((s) => s.id === shiftPosition.shiftId)!;
        const position = positions.find(
          (p) => p.id === shiftPosition.positionId
        )!;

        return {
          ...sv,
          appliedAt: new Date(sv.appliedAt),
          confirmedAt: sv.confirmedAt ? new Date(sv.confirmedAt) : undefined,
          updatedAt: new Date(sv.updatedAt),
          shiftPosition: {
            ...shiftPosition,
            shift: {
              ...shift,
              date: new Date(shift.date),
              startTime: new Date(shift.startTime),
              endTime: new Date(shift.endTime),
              createdAt: new Date(shift.createdAt),
              updatedAt: new Date(shift.updatedAt),
            },
            position: {
              ...position,
              createdAt: new Date(position.createdAt),
              updatedAt: new Date(position.updatedAt),
            },
          },
        };
      })
      .sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime());
  }

  async getCurrentUser(): Promise<User | null> {
    await this.delay();
    const userData = localStorage.getItem(this.KEYS.CURRENT_USER);
    if (!userData) return null;

    const user = JSON.parse(userData);
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  }

  async createUser(data: {
    name: string;
    email: string;
    phone?: string;
  }): Promise<User> {
    await this.delay();
    const users = this.getFromStorage<User>(this.KEYS.USERS);

    const newUser: User = {
      id: this.generateId(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);
    this.saveToStorage(this.KEYS.USERS, users);
    localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(newUser));

    return newUser;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    await this.delay();
    const users = this.getFromStorage<User>(this.KEYS.USERS);
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new Error("Usuário não encontrado");
    }

    users[userIndex] = {
      ...users[userIndex],
      ...data,
      updatedAt: new Date(),
    };

    this.saveToStorage(this.KEYS.USERS, users);

    // Update current user if it's the same
    const currentUser = await this.getCurrentUser();
    if (currentUser?.id === id) {
      localStorage.setItem(
        this.KEYS.CURRENT_USER,
        JSON.stringify(users[userIndex])
      );
    }

    return users[userIndex];
  }
}

export default LocalStorageAdapter;
