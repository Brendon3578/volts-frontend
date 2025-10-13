/**
 * API Data Adapter (Stub Implementation)
 * This is a template for implementing API calls to a REST backend
 * Replace the stubs with actual API calls using fetch or axios
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
  SignupPositionForm,
  DashboardSummary,
  VolunteerStatusType,
  ShiftStatusType,
  ApiResponse,
} from "../../models";
import type { IDataAdapter } from "./IDataAdapter";

class ApiAdapter implements IDataAdapter {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor(baseUrl: string = "/api", authToken?: string) {
    this.baseUrl = baseUrl;
    this.headers = {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: this.headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "API request failed");
      }

      return result.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Dashboard
  async getDashboardSummary(): Promise<DashboardSummary> {
    return this.request<DashboardSummary>("/dashboard/summary");
  }

  // Groups
  async getGroups(): Promise<Group[]> {
    return this.request<Group[]>("/groups");
  }

  async getGroupById(id: string): Promise<GroupWithDetails | null> {
    try {
      return await this.request<GroupWithDetails>(`/groups/${id}`);
    } catch (error) {
      console.error("Failed to fetch group by ID:", error);
      // Handle 404 - group not found
      return null;
    }
  }

  async createGroup(data: CreateGroupForm): Promise<Group> {
    return this.request<Group>("/groups", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateGroup(
    id: string,
    data: Partial<CreateGroupForm>
  ): Promise<Group> {
    return this.request<Group>(`/groups/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteGroup(id: string): Promise<void> {
    await this.request<void>(`/groups/${id}`, {
      method: "DELETE",
    });
  }

  // Group Members
  async getGroupMembers(groupId: string): Promise<GroupUser[]> {
    return this.request<GroupUser[]>(`/groups/${groupId}/members`);
  }

  async joinGroup(groupId: string, userId?: string): Promise<GroupUser> {
    return this.request<GroupUser>(`/groups/${groupId}/join`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  }

  async leaveGroup(groupId: string, userId?: string): Promise<void> {
    await this.request<void>(`/groups/${groupId}/leave`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  }

  // Positions
  async getPositionsByGroup(groupId: string): Promise<Position[]> {
    return this.request<Position[]>(`/groups/${groupId}/positions`);
  }

  async createPosition(data: CreatePositionForm): Promise<Position> {
    return this.request<Position>("/positions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePosition(
    id: string,
    data: Partial<CreatePositionForm>
  ): Promise<Position> {
    return this.request<Position>(`/positions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePosition(id: string): Promise<void> {
    await this.request<void>(`/positions/${id}`, {
      method: "DELETE",
    });
  }

  // Shifts
  async getShiftsByGroup(groupId: string): Promise<Shift[]> {
    return this.request<Shift[]>(`/groups/${groupId}/shifts`);
  }

  async getShiftById(id: string): Promise<ShiftWithDetails | null> {
    try {
      return await this.request<ShiftWithDetails>(`/shifts/${id}`);
    } catch (error) {
      console.error("Failed to fetch group by ID:", error);

      return null;
    }
  }

  async createShift(data: CreateShiftForm): Promise<Shift> {
    return this.request<Shift>("/shifts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateShift(
    id: string,
    data: Partial<CreateShiftForm>
  ): Promise<Shift> {
    return this.request<Shift>(`/shifts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteShift(id: string): Promise<void> {
    await this.request<void>(`/shifts/${id}`, {
      method: "DELETE",
    });
  }

  async updateShiftStatus(id: string, status: ShiftStatusType): Promise<Shift> {
    return this.request<Shift>(`/shifts/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // Shift Volunteering
  async signupForShift(
    shiftPositionId: string,
    data: SignupPositionForm,
    userId?: string
  ): Promise<ShiftVolunteer> {
    return this.request<ShiftVolunteer>(
      `/shift-positions/${shiftPositionId}/signup`,
      {
        method: "POST",
        body: JSON.stringify({ ...data, userId }),
      }
    );
  }

  async cancelSignup(shiftVolunteerId: string, userId?: string): Promise<void> {
    await this.request<void>(`/shift-volunteers/${shiftVolunteerId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  }

  async updateVolunteerStatus(
    shiftVolunteerId: string,
    status: VolunteerStatusType
  ): Promise<ShiftVolunteer> {
    return this.request<ShiftVolunteer>(
      `/shift-volunteers/${shiftVolunteerId}/status`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );
  }

  async getMySignups(userId?: string): Promise<
    (ShiftVolunteer & {
      shiftPosition: ShiftPosition & {
        shift: Shift;
        position: Position;
      };
    })[]
  > {
    const params = userId ? `?userId=${userId}` : "";
    return this.request<
      (ShiftVolunteer & {
        shiftPosition: ShiftPosition & {
          shift: Shift;
          position: Position;
        };
      })[]
    >(`/my-signups${params}`);
  }

  // Users
  async getCurrentUser(): Promise<User | null> {
    try {
      return await this.request<User>("/auth/me");
    } catch (error) {
      console.error("Failed to fetch group by ID:", error);

      return null;
    }
  }

  async createUser(data: {
    name: string;
    email: string;
    phone?: string;
  }): Promise<User> {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export default ApiAdapter;

/**
 * MIGRATION GUIDE: LocalStorage to API
 *
 * 1. Update your backend to implement these endpoints:
 *
 * GET    /api/dashboard/summary           - Dashboard statistics
 * GET    /api/groups                      - List all groups
 * POST   /api/groups                      - Create a new group
 * GET    /api/groups/:id                  - Get group details
 * PUT    /api/groups/:id                  - Update group
 * DELETE /api/groups/:id                  - Delete group
 *
 * GET    /api/groups/:id/members          - Get group members
 * POST   /api/groups/:id/join             - Join a group
 * POST   /api/groups/:id/leave            - Leave a group
 *
 * GET    /api/groups/:id/positions        - Get positions for a group
 * POST   /api/positions                   - Create a position
 * PUT    /api/positions/:id               - Update position
 * DELETE /api/positions/:id               - Delete position
 *
 * GET    /api/groups/:id/shifts           - Get shifts for a group
 * POST   /api/shifts                      - Create a shift
 * GET    /api/shifts/:id                  - Get shift details
 * PUT    /api/shifts/:id                  - Update shift
 * DELETE /api/shifts/:id                  - Delete shift
 * PUT    /api/shifts/:id/status           - Update shift status
 *
 * POST   /api/shift-positions/:id/signup  - Sign up for a shift position
 * POST   /api/shift-volunteers/:id/cancel - Cancel signup
 * PUT    /api/shift-volunteers/:id/status - Update volunteer status
 * GET    /api/my-signups                  - Get current user's signups
 *
 * GET    /api/auth/me                     - Get current user
 * POST   /api/users                       - Create user
 * PUT    /api/users/:id                   - Update user
 *
 * 2. Replace LocalStorageAdapter with ApiAdapter in your DataProvider:
 *
 * // In src/providers/DataProvider.tsx
 * import ApiAdapter from '../adapters/ApiAdapter';
 *
 * const adapter = new ApiAdapter('http://your-api-url/api', authToken);
 *
 * 3. Expected API Response Format:
 *
 * {
 *   "success": true,
 *   "data": {...}, // Your data here
 *   "message": "Optional success message"
 * }
 *
 * For errors:
 * {
 *   "success": false,
 *   "message": "Error description"
 * }
 */
