/**
 * Create Shift Dialog Component
 * Modal dialog for creating new shifts/escalas
 */

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
import { Plus } from "lucide-react";
import type { PositionDto } from "../../models/position";
import { useCreateShift } from "../../hooks/useShifts";
import type { CreateShiftDto } from "../../models/shift";
import { addHours, toHtmlDatetimeLocal } from "../../utils";
import { ShiftBasicInfoFields } from "./CreateShiftDialog/ShiftBasicInfoFields";
import { ShiftPositionsEditor } from "./CreateShiftDialog/ShiftPositionsEditor";
import { ShiftDateFields } from "./CreateShiftDialog/ShiftDateFields";

const createShiftSchema = z.object({
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

interface CreateShiftDialogProps {
  groupId: string;
  positions: PositionDto[];
  trigger?: ReactNode;
}

export const CreateShiftDialog = memo(function CreateShiftDialog({
  groupId,
  positions,
  trigger,
}: CreateShiftDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createShift, isPending: isCreating } = useCreateShift();

  const form = useForm<CreateShiftDto>({
    resolver: zodResolver(createShiftSchema),
    defaultValues: {
      title: "",
      startDate: toHtmlDatetimeLocal(addHours(1)),
      endDate: toHtmlDatetimeLocal(addHours(2)),
      notes: "",
      groupId,
      positions: [{ positionId: "", requiredCount: 1 }],
    },
  });

  const onSubmit = async (data: CreateShiftDto) => {
    try {
      const result = await createShift(data);
      if (result) {
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating shift:", error);
      // Error handling is done in the parent component/hook
    }
  };

  const defaultTrigger = (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Nova Escala
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Escala</DialogTitle>
          <DialogDescription>
            Configure uma nova escala com data, horário e posições necessárias.
          </DialogDescription>
        </DialogHeader>

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
                disabled={isCreating}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Criando..." : "Criar Escala"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
