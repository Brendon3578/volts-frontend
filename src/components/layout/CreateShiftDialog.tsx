/**
 * Create Shift Dialog Component
 * Modal dialog for creating new shifts/escalas
 */

import { useState, type ReactNode } from "react";
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
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Plus, Minus } from "lucide-react";
import type { CreateShiftForm, Position, Shift } from "../../models/types";

const createShiftSchema = z.object({
  title: z.string().max(100, "Título muito longo").optional(),
  date: z.string().min(1, "Data é obrigatória"),
  startTime: z.string().min(1, "Horário de início é obrigatório"),
  endTime: z.string().min(1, "Horário de fim é obrigatório"),
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
  positions: Position[];
  onCreateShift: (data: CreateShiftForm) => Promise<Shift | null>;
  trigger?: ReactNode;
}

export function CreateShiftDialog({
  groupId,
  positions,
  onCreateShift,
  trigger,
}: CreateShiftDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateShiftForm>({
    resolver: zodResolver(createShiftSchema),
    defaultValues: {
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      notes: "",
      groupId,
      positions: [{ positionId: "", requiredCount: 1 }],
    },
  });

  const onSubmit = async (data: CreateShiftForm) => {
    try {
      setIsSubmitting(true);
      const result = await onCreateShift(data);
      if (result) {
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating shift:", error);
      // Error handling is done in the parent component/hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPosition = () => {
    const currentPositions = form.getValues("positions");
    form.setValue("positions", [
      ...currentPositions,
      { positionId: "", requiredCount: 1 },
    ]);
  };

  const removePosition = (index: number) => {
    const currentPositions = form.getValues("positions");
    if (currentPositions.length > 1) {
      form.setValue(
        "positions",
        currentPositions.filter((_, i) => i !== index)
      );
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Culto Domingo Manhã" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário de Início</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário de Fim</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre a escala..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Posições Necessárias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch("positions").map((_, index) => (
                  <div key={index} className="flex items-end gap-3">
                    <FormField
                      control={form.control}
                      name={`positions.${index}.positionId`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Posição</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="">Selecione uma posição</option>
                              {positions.map((position) => (
                                <option key={position.id} value={position.id}>
                                  {position.name}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`positions.${index}.requiredCount`}
                      render={({ field }) => (
                        <FormItem className="w-24">
                          <FormLabel>Qtd</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("positions").length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removePosition(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addPosition}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Posição
                </Button>
              </CardContent>
            </Card>

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
                {isSubmitting ? "Criando..." : "Criar Escala"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
