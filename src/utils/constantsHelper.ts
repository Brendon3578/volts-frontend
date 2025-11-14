import {
  type OrganizationRoleType,
  type GroupRoleType,
  type ShiftStatusType,
  type VolunteerStatusType,
  OrganizationRole,
} from "../models";

export function OrganizationRoleToReadableFormat(
  role: OrganizationRoleType | string
): string {
  switch (role) {
    case "OWNER":
      return "Dono";
    case "ADMIN":
      return "Administrador";
    case "MEMBER":
      return "Membro";
    default:
      return "Membro";
  }
}

export function GroupRoleToReadableFormat(
  role: GroupRoleType | string
): string {
  switch (role) {
    case "GROUP_LEADER":
      return "Líder";
    case "COORDINATOR":
      return "Coordenador";
    case "VOLUNTEER":
      return "Voluntário";
    default:
      return "Voluntário";
  }
}

export function ShiftStatusToReadableFormat(
  status: ShiftStatusType & string
): string {
  switch (status) {
    case "OPEN":
      return "Aberto";
    case "FILLED":
      return "Preenchido";
    case "CANCELLED":
      return "Cancelado";
    default:
      return "Aberto";
  }
}

export function VolunteerStatusToReadableFormat(
  status: VolunteerStatusType & string
): string {
  switch (status) {
    case "CONFIRMED":
      return "Confirmado";
    case "PENDING":
      return "Pendente";
    case "CANCELLED":
      return "Cancelado";
    default:
      return "Pendente";
  }
}

const leadersRoles: string[] = [
  OrganizationRole.ADMIN,
  OrganizationRole.LEADER,
];

export function isUserOrganizationLeaderOrAdmin(role?: string) {
  if (!role) return false;
  return leadersRoles.includes(role);
}

export function isUserOrganizationAdmin(role?: string) {
  if (!role) return false;
  return OrganizationRole.ADMIN == role;
}

export function isUserOrganizationLeader(role?: string) {
  if (!role) return false;
  return OrganizationRole.LEADER == role;
}

export function isUserOrganizationVolunteer(role?: string) {
  if (!role) return false;
  return OrganizationRole.MEMBER == role;
}
