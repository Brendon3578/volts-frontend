// Enums matching Prisma schema
export const OrganizationRole = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  MEMBER: "MEMBER",
} as const;

export const GroupRole = {
  GROUP_LEADER: "GROUP_LEADER",
  COORDINATOR: "COORDINATOR",
  VOLUNTEER: "VOLUNTEER",
} as const;

export const ShiftStatus = {
  OPEN: "OPEN",
  FILLED: "FILLED",
  CANCELLED: "CANCELLED",
} as const;

export const VolunteerStatus = {
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
} as const;
