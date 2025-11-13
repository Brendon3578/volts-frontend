/**
 * Create Group Dialog Component
 * Modal dialog for creating new groups
 */

import { memo, useCallback, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { CircleOff, Plus } from "lucide-react";
import { createGroupSchema } from "../../lib/schemas";
import { useCreateGroup } from "../../hooks/useGroups";
import type { CreateGroupDto } from "../../api/types/group";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { groupColors } from "../../utils/groupColors";
import { iconOptions } from "../../utils";
import { GroupColorSelector } from "../groups/GroupColorSelector";
import { GroupIconSelector } from "../groups/GroupIconSelector";
import { isAxiosError } from "axios";
import { toast } from "sonner";

interface CreateGroupDialogProps {
  trigger?: ReactNode;
  organizationId: string;
}

export function CreateGroupDialog({
  trigger,
  organizationId,
}: CreateGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createGroup, isPending } = useCreateGroup();

  const form = useForm<CreateGroupDto>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      organizationId: organizationId,
    },
  });

  const onSubmit = async (data: CreateGroupDto) => {
    try {
      console.log(data);
      const result = await createGroup(data);
      if (result) {
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error);
        if (error.status == 403) {
          toast.error("Você não tem permissão para criar um grupo");
        }
      }
      // Error handling is done in the parent component/hook
    }
  };

  const handleSetColor = useCallback(
    (color: string | undefined) => form.setValue("color", color),
    [form]
  );

  const handleSetIcon = useCallback(
    (icon: string | undefined) => form.setValue("icon", icon),
    [form]
  );

  const defaultTrigger = (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Novo Grupo
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[528px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Grupo</DialogTitle>
          <DialogDescription>
            Crie um novo grupo para organizar suas atividades voluntárias.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Grupo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Ministério de Louvor" {...field} />
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
                      placeholder="Descreva o propósito e atividades do grupo..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="bg-neutral-300" />

            <Label>Estilização do Grupo</Label>

            <div className="w-full justify-items-center grid grid-cols-6 gap-3 max-w-sm">
              {groupColors.map((color) => {
                return (
                  <GroupColorSelector
                    key={color.color}
                    onClick={() => handleSetColor(color.color)}
                    label={color.label}
                    color={color.color}
                    isSelected={form.watch("color") == color.color}
                  />
                );
              })}
              <GroupColorSelector
                className="color-undefined"
                label="Remover cor"
                color={undefined}
                onClick={() => handleSetColor(undefined)}
                isSelected={false}
              />
            </div>

            <Separator />

            <div className="w-full justify-items-center grid grid-cols-6 gap-1.5  max-w-sm ">
              {iconOptions.map((icon) => {
                return (
                  <GroupIconSelector
                    key={icon.id}
                    label={icon.label}
                    Icon={icon.Icon}
                    onClick={() => handleSetIcon(icon.id)}
                    isSelected={form.watch("icon") == icon.id}
                  />
                );
              })}
              <GroupIconSelector
                onClick={() => handleSetIcon(undefined)}
                label={"Remover ícone"}
                Icon={CircleOff}
                iconColor="text-red-700"
                isSelected={false}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} variant={"secondary"}>
                {isPending ? "Criando..." : "Criar Grupo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
