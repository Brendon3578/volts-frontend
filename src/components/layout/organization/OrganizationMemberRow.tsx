import { useState, useMemo } from "react";
import { TableRow, TableCell } from "../../../components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { ConfirmActionDialog } from "../../../components/common/ConfirmActionDialog";
import { toast } from "sonner";
import type {
  ChangeOrganizationMemberRoleDto,
  OrganizationMemberDto,
} from "../../../models/organization";
import { Save, Trash } from "lucide-react";
import { OrganizationRole } from "../../../models";
import {
  isUserOrganizationAdmin,
  isUserOrganizationLeader,
  isUserOrganizationVolunteer,
} from "../../../utils";
import { useChangeOrganizationMemberRole } from "../../../hooks/useOrganizations";

interface Props {
  member: OrganizationMemberDto;
  currentUserRole: string;
  organizationId: string;
  currentUserId: string;
}

export function OrganizationMemberRow({
  member,
  currentUserRole,
  currentUserId,
  organizationId,
}: Props) {
  const { mutateAsync: changeMemberRole } = useChangeOrganizationMemberRole();
  const [role, setRole] = useState(member.role);

  const isCurrentUserAdmin = isUserOrganizationAdmin(currentUserRole);
  const isCurrentUserLeader = isUserOrganizationLeader(currentUserRole);
  const isCurrentUserMember = isUserOrganizationVolunteer(currentUserRole);

  const isRowAdmin = member.role === OrganizationRole.ADMIN;
  const isRowMember = member.role === OrganizationRole.MEMBER;
  const isRowLeader = member.role === OrganizationRole.LEADER;

  const isSelf = member.userId === currentUserId;

  async function saveRoleChanges() {
    if (isCurrentUserMember) return;
    const memberId = member.id;

    const payload: ChangeOrganizationMemberRoleDto = {
      role: role,
    };

    try {
      await changeMemberRole({ organizationId, memberId, payload });
      toast.success("Perfil alterado com sucesso!");
    } catch (error) {
      toast.error("Erro ao alterar o perfil!");
    }
  }

  // -----------------------------
  // Disable rules - ROLE CHANGES
  // -----------------------------
  const disableRoleSelector = useMemo(() => {
    if (isCurrentUserMember) return true; // member nunca altera nada

    if (isCurrentUserAdmin) {
      if (isSelf) return true; // admin não altera a própria role
      return false; // admin pode alterar qualquer outra linha
    }

    if (isCurrentUserLeader) {
      if (isRowAdmin) return true; // leader não altera ADMIN
      if (isSelf) return true; // leader não altera a própria role
      return false;
    }

    return true;
  }, [
    isCurrentUserAdmin,
    isCurrentUserLeader,
    isCurrentUserMember,
    isSelf,
    isRowAdmin,
  ]);

  // -----------------------------
  // Options permitidas - LEADER
  // -----------------------------
  const roleOptions = useMemo(() => Object.keys(OrganizationRole), []);

  function handleRoleChange(newRole: string) {
    if (disableRoleSelector) return;

    // Leaders NÃO PODEM promover para ADMIN
    if (isCurrentUserLeader && newRole === OrganizationRole.ADMIN) {
      toast.warning("Apenas administradores podem promover para Admin.");
      return;
    }

    // Admin não pode remover seu próprio admin status
    if (isCurrentUserAdmin && isSelf && newRole !== OrganizationRole.ADMIN) {
      toast.warning("Você não pode mudar a própria role de Admin.");
      return;
    }

    setRole(newRole);
  }

  // -----------------------------
  // Disable rules - DELETE
  // -----------------------------
  const disableDeleteButton = useMemo(() => {
    if (isCurrentUserMember) return true; // member não deleta nada

    if (isCurrentUserAdmin) {
      if (isSelf) return true; // admin não pode deletar a si mesmo
      return false;
    }

    if (isCurrentUserLeader) {
      if (isRowAdmin) return true; // leader não deleta admin
      return false;
    }

    return true;
  }, [
    isCurrentUserAdmin,
    isCurrentUserLeader,
    isCurrentUserMember,
    isSelf,
    isRowAdmin,
  ]);

  return (
    <TableRow key={member.id}>
      <TableCell>{member.userName}</TableCell>
      <TableCell>{member.userEmail}</TableCell>

      <TableCell>
        <Select
          value={role}
          onValueChange={handleRoleChange}
          disabled={disableRoleSelector}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Cargo" />
          </SelectTrigger>

          <SelectContent>
            {roleOptions.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell>
        <div className="flex gap-2">
          <Button onClick={saveRoleChanges}>
            <Save />
          </Button>
          <ConfirmActionDialog
            title="Remover membro"
            description="Confirme para remover este membro."
            onConfirm={async () => {
              try {
                toast.success("Membro removido");
              } catch {
                toast.error("Falha ao remover membro");
              }
            }}
            variant="destructive"
            confirmLabel="Remover"
            trigger={
              <Button variant="destructive" disabled={disableDeleteButton}>
                <Trash />
              </Button>
            }
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
