/**
 * Signup Dialog Component
 * Modal dialog for signing up to shift positions
 */

import React from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import type { SignupForm } from "../../models/types";

const signupSchema = z.object({
  notes: z.string().max(500, "Observações muito longas").optional(),
});

interface SignupDialogProps {
  positionName: string;
  onSignup: (data: SignupForm) => Promise<boolean>;
  trigger?: React.ReactNode;
}

export const SignupDialog: React.FC<SignupDialogProps> = ({
  positionName,
  onSignup,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      notes: "",
    },
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      setIsSubmitting(true);
      const result = await onSignup(data);
      if (result) {
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      // Error handling is done in the parent component/hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button size="sm">
      <UserPlus className="h-4 w-4 mr-1" />
      Inscrever-se
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inscrever-se para {positionName}</DialogTitle>
          <DialogDescription>
            Confirme sua inscrição para esta posição. Você pode adicionar
            observações opcionais.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione qualquer informação relevante para sua participação..."
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
                {isSubmitting ? "Inscrevendo..." : "Confirmar Inscrição"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
