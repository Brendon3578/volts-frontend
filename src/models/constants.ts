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

export const Gender = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
  PREFER_NOT_TO_SAY: "prefer_not_to_say",
} as const;

export const GenderOptions = [
  { value: Gender.MALE, label: "Masculino" },
  { value: Gender.FEMALE, label: "Feminino" },
  { value: Gender.OTHER, label: "Outro" },
  { value: Gender.PREFER_NOT_TO_SAY, label: "Prefiro não dizer" },
] as const;
