import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Plus, Minus } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { CreateShiftDto } from "../../../models/shift";
import type { PositionDto } from "../../../models/position";

interface Props {
  form: UseFormReturn<CreateShiftDto>;
  positions: PositionDto[];
}

export function ShiftPositionsEditor({ form, positions }: Props) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Posições Necessárias</CardTitle>
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
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
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
  );
}
