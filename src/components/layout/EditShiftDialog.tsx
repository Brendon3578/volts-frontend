import { memo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Plus, AlertCircle, Edit } from "lucide-react";
import type { PositionDto } from "../../models/position";
import { useUpdateShift } from "../../hooks/useShifts";
import type {
  CreateShiftDto,
  ShiftDto,
  UpdateShiftDto,
} from "../../models/shift";
import { toHtmlDatetimeLocal } from "../../utils";
import { useSelfOrganizationRole } from "../../hooks/useOrganizations";
import { ShiftBasicInfoFields } from "./CreateShiftDialog/ShiftBasicInfoFields";
import { ShiftDateFields } from "./CreateShiftDialog/ShiftDateFields";
import { ShiftPositionsEditor } from "./CreateShiftDialog/ShiftPositionsEditor";
import type { ShiftCompleteViewDto } from "../../models/shiftCompleteView";
import { toast } from "sonner";

const editShiftSchema = z.object({
  title: z.string().max(100, "Título muito longo"),
  startDate: z.string().min(1, "Horário de início é obrigatório"),
  endDate: z.string().min(1, "Horário de fim é obrigatório"),
  notes: z.string().max(500, "Observações muito longas").optional(),
  groupId: z.string(),
  positions: z
    .array(
      z.object({
        positionId: z.string().min(1, "Posição é obrigatória"),
        requiredCount: z.number().min(1, "Quantidade deve ser pelo menos 1"),
      })
    )
    .min(1, "Pelo menos uma posição é obrigatória"),
});

interface EditShiftDialogProps {
  shift: ShiftDto;
  positions: PositionDto[];
  trigger?: ReactNode;
  organizationId: string;
}

export const EditShiftDialog = memo(function EditShiftDialog({
  shift,
  positions,
  trigger,
  organizationId,
}: EditShiftDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateShift, isPending: isUpdating } = useUpdateShift();
  const { data: userRole } = useSelfOrganizationRole(organizationId);
  const canUpdate = Boolean(
    userRole?.role && (userRole.role === "ADMIN" || userRole.role === "LEADER")
  );

  const form = useForm<CreateShiftDto>({
    resolver: zodResolver(editShiftSchema),
    defaultValues: {
      title: shift.title || "",
      startDate: toHtmlDatetimeLocal(new Date(shift.startDate)),
      endDate: toHtmlDatetimeLocal(new Date(shift.endDate)),
      notes: shift.notes || "",
      groupId: shift.groupId,
      positions: shift.positions.map((p) => ({
        positionId: p.positionId,
        requiredCount: p.requiredCount,
      })),
    },
  });

  console.log(form.getValues());

  const onSubmit = async (data: CreateShiftDto) => {
    try {
      if (!canUpdate) return;
      const payload: UpdateShiftDto = {
        title: data.title,
        notes: data.notes,
        startDate: data.startDate,
        endDate: data.endDate,
        positions: data.positions,
      };
      const result = await updateShift({
        id: shift.id,
        payload,
        groupId: shift.groupId,
      });

      toast.success("Escala atualizada com sucesso!");

      if (result) {
        setOpen(false);
      }
    } catch (error) {
      toast.error("Falha ao atualizar");
    }
  };

  const defaultTrigger = (
    <Button>
      <Edit className="h-4 w-4 mr-2" />
      Editar Escala
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Escala</DialogTitle>
          <DialogDescription>
            Atualize as informações da escala.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 p-3 text-warning">
          <AlertCircle className="h-4 w-4 mt-[2px]" />
          <span>
            Ao editar a escala, todas as posições serão refeitas e os
            voluntários precisarão se inscrever novamente.
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ShiftBasicInfoFields form={form} />
            <ShiftDateFields form={form} />
            <ShiftPositionsEditor form={form} positions={positions} />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdating || !canUpdate}>
                {isUpdating ? "Atualizando..." : "Atualizar Escala"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
