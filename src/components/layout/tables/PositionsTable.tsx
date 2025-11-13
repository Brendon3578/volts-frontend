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

interface PositionsTableProps {
  positions?: PositionDto[];
  group: GroupCompleteViewDto;
}

export function PositionsTable({ positions, group }: PositionsTableProps) {
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
                // onUpdate={onUpdatePosition}
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
}: {
  position: PositionDto;
  group: GroupCompleteViewDto;
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
              console.log("Terminar essa função");
              // await onDelete(position);
            }}
          />
        </div>
      </TableCell>
    </TableRow>
  );
});
