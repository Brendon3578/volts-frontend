import { memo, useCallback, useMemo, useState } from "react";
import type { CreatePositionForm } from "../../models";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Contact, Edit } from "lucide-react";
import { Label } from "../ui/label";
import type { GroupCompleteViewDto } from "../../api/types/group";
import type { CreatePositionDto, PositionDto } from "../../models/position";
import { useCreatePosition, useUpdatePosition } from "../../hooks/usePositions";
import { toast } from "sonner";

interface PositionFormDialogProps {
  group: GroupCompleteViewDto;
  existingPosition?: PositionDto; // Optional - if provided, component is in edit mode
  trigger?: React.ReactNode;
}

const positionFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().max(500).optional(),
  groupId: z.string(),
});

export const PositionFormDialog = memo(function PositionFormDialog({
  group,
  trigger,
  existingPosition,
}: PositionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createPosition, isPending: isCreating } =
    useCreatePosition();
  const { mutateAsync: updatePosition, isPending: isUpdating } =
    useUpdatePosition();

  const isSubmitting = isCreating || isUpdating;

  const isEditMode = Boolean(existingPosition);

  const form = useForm<CreatePositionDto>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      name: existingPosition?.name || "",
      description: existingPosition?.description || "",
      groupId: group.id,
    },
    shouldUnregister: false,
  });

  // Reset form when existingPosition changes (useful for edit mode)

  const onSubmit = useCallback(
    async (data: CreatePositionForm) => {
      try {
        let result: PositionDto | null = null;

        if (isEditMode && existingPosition) {
          result = await updatePosition({
            id: existingPosition.id,
            payload: data,
          });
        } else {
          result = await createPosition(data);
        }

        if (result) {
          toast.success(
            `${isEditMode ? "Atualizado" : "Criado"} posição com sucesso.`
          );
          setOpen(false);
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    },
    [isEditMode, existingPosition, updatePosition, createPosition]
  );

  const dialogDetails = useMemo(
    () =>
      isEditMode
        ? {
            title: "Editar Posição",
            description: "Modifique os dados da posição existente.",
            submit: "Salvar Alterações",
            loading: "Salvando...",
            buttonLabel: "Editar Posição",
            icon: Edit,
          }
        : {
            title: "Criar Posição",
            description: "Crie uma nova posição de escala no grupo.",
            submit: "Criar Posição",
            loading: "Criando...",
            buttonLabel: "Nova Posição",
            icon: Contact,
          },
    [isEditMode]
  );

  const defaultTrigger = useMemo(() => {
    const Icon = dialogDetails.icon;
    return (
      <Button>
        <Icon className="mr-2 h-4 w-4" />
        {dialogDetails.buttonLabel}
      </Button>
    );
  }, [dialogDetails]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (isOpen) {
        form.reset({
          name: existingPosition?.name ?? "",
          description: existingPosition?.description ?? "",
          groupId: group.id,
        });
      }
    },
    [existingPosition, group.id, form]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogDetails.title}</DialogTitle>
          <DialogDescription>{dialogDetails.description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label>Grupo</Label>
              <Input value={group.name} disabled />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block after:ml-0.5 after:text-red-500 after:content-['*']">
                    Nome da posição
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Fotógrafo, Baterista"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva as atividades dessa posição..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? dialogDetails.loading : dialogDetails.submit}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
