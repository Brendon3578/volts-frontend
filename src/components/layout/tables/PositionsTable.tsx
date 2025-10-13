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
import type {
  CreatePositionForm,
  GroupWithDetails,
  Position,
} from "../../../models";
import { PositionFormDialog } from "../PositionFormDialog";
import { memo } from "react";
import { ConfirmActionDialog } from "./../../common/ConfirmActionDialog";

interface PositionsTableProps {
  positions: Position[];
  group: GroupWithDetails;

  onUpdatePosition: (
    id: string,
    data: Partial<CreatePositionForm>
  ) => Promise<Position | null>;
  onDeletePosition: (position: Position) => Promise<boolean>;
}

export function PositionsTable({
  positions,
  onUpdatePosition,
  onDeletePosition,
  group,
}: PositionsTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Nome</TableHead>
            <TableHead className="font-semibold">Descrição</TableHead>
            <TableHead className="text-right font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.length === 0 ? (
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
                onDelete={onDeletePosition}
                group={group}
                onUpdate={onUpdatePosition}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const PositionRow = memo(function PositionRow({
  position,
  group,
  onUpdate,
  onDelete,
}: {
  position: Position;
  group: GroupWithDetails;
  onUpdate: PositionsTableProps["onUpdatePosition"];
  onDelete: PositionsTableProps["onDeletePosition"];
}) {
  return (
    <TableRow key={position.id}>
      <TableCell className="font-medium">{position.name}</TableCell>
      <TableCell className="text-muted-foreground">
        {position.description || "Sem descrição"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <PositionFormDialog
            group={group}
            onUpdatePosition={onUpdate}
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
            onConfirm={async () => {
              await onDelete(position);
            }}
          />
        </div>
      </TableCell>
    </TableRow>
  );
});
