/**
 * Group Configuration
 * Shows detailed information about a specific group
 */

import { useParams, useNavigate } from "react-router-dom";
import { useGroup, useGroups } from "../../hooks/useGroups";
import { useShifts } from "../../hooks/useShifts";
import { usePositions } from "../../hooks/usePositions";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { ShiftCard } from "../../components/layout/ShiftCard";
import { CreateShiftDialog } from "../../components/layout/CreateShiftDialog";
import {
  ArrowLeft,
  Users,
  Calendar,
  Settings,
  Plus,
  MapPin,
  Clock,
  User,
  Upload,
  CircleOff,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuthentication } from "../../hooks/useAuthentication";
import { Input } from "../../components/ui/input";
import { PositionFormDialog } from "../../components/layout/PositionFormDialog";
import { PositionsTable } from "../../components/layout/tables/PositionsTable";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Textarea } from "../../components/ui/textarea";
import { useForm, useWatch } from "react-hook-form";
import type { CreateGroupForm } from "../../models/types";
import { memo, useCallback, useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGroupSchema } from "../../lib/schemas";
import AdvancedImageUpload from "../../components/layout/GroupImageUpload";
import { Label } from "../../components/ui/label";

import { getGroupIcon, groupColors, iconOptions } from "../../utils";
import { GroupTitle } from "./GroupTitle";

export function GroupSettings() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { group, loading: groupLoading, refetch } = useGroup(id!);
  const { updateGroup, deleteGroup } = useGroups();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
    values: {
      name: group?.name || "",
      description: group?.description || "",
      color: group?.color || "",
      icon: group?.icon || "",
    },
  });

  const onSubmit = async (data: CreateGroupForm) => {
    if (!id) return;
    console.log(data);
    try {
      setIsSubmitting(true);

      const result = await updateGroup(id, data);

      refetch();
    } catch (error) {
      console.log(error);
      // Error handling is done in the parent component/hook
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("renderizou");

  const selectedIconId = useWatch({ control: form.control, name: "icon" });

  const selectedIcon = getGroupIcon(selectedIconId);

  const handleSetColor = useCallback(
    (color: string | undefined) => form.setValue("color", color),
    [form]
  );

  const handleSetIcon = useCallback(
    (icon: string | undefined) => form.setValue("icon", icon),
    [form]
  );

  if (groupLoading || !group) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <section className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <GroupTitle group={group} />
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Users className="mr-1 h-3 w-3" />
                  {group.members.length} membros
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Dados do Grupo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Grupo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Ministério de Louvor"
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
                          placeholder="Descreva o propósito e atividades do grupo..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Exibição do Grupo</CardTitle>
                <CardDescription>
                  Escolha as configurações de exibição do grupo
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4 items-start flex-wrap">
                <AdvancedImageUpload
                  labelText="Imagem da capa do Grupo"
                  className="lg:max-w-md"
                />

                <div className="max-w-50 flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor do grupo</FormLabel>
                        <div className="flex sm:gap-2">
                          <FormControl>
                            <Input className="w-15" type="color" {...field} />
                          </FormControl>
                          <Input type="text" {...field} />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full justify-items-center grid grid-cols-4 gap-2">
                    {groupColors.map((color) => {
                      return (
                        <GroupColorSelector
                          key={color.color}
                          onClick={() => handleSetColor(color.color)}
                          label={color.label}
                          color={color.color}
                        />
                      );
                    })}
                    <GroupColorSelector
                      className="color-undefined"
                      label="Remover cor"
                      color={undefined}
                      onClick={() => handleSetColor(undefined)}
                    />
                  </div>
                </div>

                <div className="max-w-64 flex flex-col gap-2">
                  <Label>Ícone do Grupo</Label>

                  <div className="flex  gap-2 items-center">
                    <div className="h-10 w-10 min-w-10  flex items-center justify-center dark:bg-input/30 border-input rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none">
                      {selectedIcon && selectedIcon.Icon && (
                        <selectedIcon.Icon className="h-6 w-6" />
                      )}
                    </div>
                    <Input
                      type="text"
                      value={selectedIcon?.label || "Nenhum ícone selecionado"}
                      readOnly
                    />
                  </div>

                  <div className="w-full justify-items-center grid grid-cols-5 gap-2">
                    {iconOptions.map((icon) => {
                      return (
                        <GroupIconSelector
                          key={icon.id}
                          label={icon.label}
                          Icon={icon.Icon}
                          onClick={() => handleSetIcon(icon.id)}
                        />
                      );
                    })}
                    <GroupIconSelector
                      onClick={() => handleSetIcon(undefined)}
                      label={"Remover Ícone"}
                      Icon={CircleOff}
                      iconColor="text-red-900"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => navigate(-1)} variant={"outline"}>
                Cancelar
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

interface GroupColorSelectorProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: string | undefined;
  label: string;
}

const GroupColorSelector = memo(
  ({ color, label, className, ...props }: GroupColorSelectorProps) => {
    return (
      <button
        type="button"
        title={label}
        className={`cursor-pointer w-6 h-6 rounded border-foreground/15 border hover:scale-125 transition-all ${className}`}
        style={{ backgroundColor: color }}
        {...props}
      />
    );
  }
);
interface GroupIconSelectorProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor?: string;
}

const GroupIconSelector = memo(
  ({
    Icon,
    label,
    iconColor = "text-gray-700",
    ...props
  }: GroupIconSelectorProps) => {
    return (
      <button
        type="button"
        className="flex items-center justify-center cursor-pointer w-8 h-8 rounded border-foreground/15 border hover:scale-125 transition-all"
        title={`Ícone de ${label}`}
        {...props}
      >
        <Icon className={iconColor} />
      </button>
    );
  }
);
