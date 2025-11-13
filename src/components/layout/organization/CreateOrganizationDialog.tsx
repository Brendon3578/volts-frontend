/**
 * Create Organization Dialog Component
 * Modal dialog for creating new Organizations
 */

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import type { CreateOrganizationDto } from "../../../models/organization";
import { createOrganizationSchema } from "../../../lib/schemas";
import { useCreateOrganization } from "../../../hooks/useOrganizations";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CreateOrganizationDialogProps {
  trigger?: ReactNode;
}

export function CreateOrganizationDialog({
  trigger,
}: CreateOrganizationDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createOrganization, isPending } =
    useCreateOrganization();
  const navigate = useNavigate();

  const form = useForm<CreateOrganizationDto>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateOrganizationDto) => {
    try {
      const newOrganization = await createOrganization(data);

      if (newOrganization) {
        form.reset();
        setOpen(false);

        navigate(`/organizations/${newOrganization.id}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Houve um erro ao criar a organização!");
      // Error handling is done in the parent component/hook
    }
  };

  const defaultTrigger = (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Nova Organização
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Organização</DialogTitle>
          <DialogDescription>
            Crie um nova organização para organizar suas escalas e atividades.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da organização</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: ONG Saúde e Vida, Empresa Systems"
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
                      placeholder="Descreva o propósito e atividades da organização..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 w-full *:w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="systems@ong.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Av. Fictícia 120" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
              <Button type="submit" disabled={isPending} variant={"default"}>
                {isPending ? "Criando..." : "Criar Organização"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
