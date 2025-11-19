import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { CreatePositionForm } from "../../../models";
import { PositionFormDialog } from "../PositionFormDialog";
import { memo } from "react";
import { ConfirmActionDialog } from "./../../common/ConfirmActionDialog";
import type { GroupCompleteViewDto } from "../../../api/types/group";
import type { PositionDto } from "../../../models/position";
import { useDeletePosition } from "../../../hooks/usePositions";
import { toast } from "sonner";
import type { OrganizationUserRoleDto } from "../../../models/organization";
import { WithPermission } from "../../common/WithPermission";

interface PositionsTableProps {
  positions?: PositionDto[];
  group: GroupCompleteViewDto;
  isUserAdminOrLeader: boolean;
}

export const PositionsTable = memo(function PositionsTable({
  positions,
  group,
  isUserAdminOrLeader,
}: PositionsTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Nome</TableHead>
            <TableHead className="font-semibold">Descrição</TableHead>
            <WithPermission can={isUserAdminOrLeader}>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </WithPermission>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!positions || positions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-24 text-center text-muted-foreground"
              >
                Nenhuma posição cadastrada.
              </TableCell>
            </TableRow>
          ) : (
            positions.map((position) => (
              <PositionRow
                key={position.id}
                position={position}
                // onDelete={onDeletePosition}
                group={group}
                isUserOrganizationAdmin={isUserAdminOrLeader}
                // onUpdate={onUpdatePosition}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
});

const PositionRow = memo(function PositionRow({
  position,
  group,
  isUserOrganizationAdmin,
}: {
  position: PositionDto;
  group: GroupCompleteViewDto;
  isUserOrganizationAdmin: boolean;
}) {
  const { mutateAsync: deletePosition } = useDeletePosition();

  async function deletePositionAction() {
    try {
      if (!isUserOrganizationAdmin) {
        toast.error("Você não tem permissão");
        return;
      }
      await deletePosition(position.id);
      toast.success("Posição removida com sucesso");
    } catch {
      toast.error("Erro ao remover posição");
    }
  }

  return (
    <TableRow key={position.id}>
      <TableCell className="font-medium">{position.name}</TableCell>
      <TableCell className="text-muted-foreground">
        {position.description || "Sem descrição"}
      </TableCell>
      <WithPermission can={isUserOrganizationAdmin}>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <PositionFormDialog
              group={group}
              existingPosition={position}
              trigger={
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              }
            />

            <ConfirmActionDialog
              trigger={
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Deletar
                </Button>
              }
              title="Deletar posição"
              description={`Tem certeza que deseja deletar a posição "${position.name}"? Esta ação não pode ser desfeita.`}
              confirmLabel="Deletar"
              variant="destructive"
              onConfirm={deletePositionAction}
            />
          </div>
        </TableCell>
      </WithPermission>
    </TableRow>
  );
});
