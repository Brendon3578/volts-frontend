import { useEffect, useMemo, useState } from "react";
import type {
  CreatePositionForm,
  GroupWithDetails,
  Position,
} from "../../models/types";
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
import { Edit, Plus } from "lucide-react";
import { Label } from "../ui/label";

interface PositionFormDialogProps {
  group: GroupWithDetails;
  existingPosition?: Position; // Optional - if provided, component is in edit mode
  onCreatePosition?: (data: CreatePositionForm) => Promise<Position | null>;
  onUpdatePosition?: (
    id: string,
    data: Partial<CreatePositionForm>
  ) => Promise<Position | null>;
  trigger?: React.ReactNode;
}

const positionFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().max(500).optional(),
  groupId: z.string(),
});

export function PositionFormDialog({
  group,
  onCreatePosition,
  onUpdatePosition,
  trigger,
  existingPosition,
}: PositionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(existingPosition);

  const form = useForm<CreatePositionForm>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      name: existingPosition?.name || "",
      description: existingPosition?.description || "",
      groupId: group.id,
    },
  });

  // Reset form when existingPosition changes (useful for edit mode)

  const onSubmit = async (data: CreatePositionForm) => {
    // Add groupId to the data before submitting
    try {
      setIsSubmitting(true);

      let result: Position | null = null;

      if (isEditMode && existingPosition && onUpdatePosition) {
        result = await onUpdatePosition(existingPosition.id, data);
      } else if (!isEditMode && onCreatePosition) {
        result = await onCreatePosition(data);
      }

      if (result) {
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} position:`,
        error
      );
      // Error handling is done in the parent component/hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogDetails = isEditMode
    ? {
        title: "Editar Posição",
        description: "Modifique os dados da posição existente.",
        submit: "Salvar Alterações",
        loading: "Salvando...",
      }
    : {
        title: "Criar Posição",
        description: "Crie uma nova posição de escala no grupo.",
        submit: "Criar Posição",
        loading: "Criando...",
      };

  const defaultTrigger = useMemo(
    () => (
      <Button>
        {isEditMode ? (
          <>
            <Edit className="mr-2 h-4 w-4" />
            Editar Posição
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Nova Posição
          </>
        )}
      </Button>
    ),
    [isEditMode]
  );

  console.log("renderizou");

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) {
      form.reset({
        name: existingPosition?.name ?? "",
        description: existingPosition?.description ?? "",
        groupId: group.id,
      });
    }
  }

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
}
