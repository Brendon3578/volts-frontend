/**
 * Group Configuration
 * Shows detailed information about a specific group
 */

import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { ArrowLeft, CircleOff, Trash2 } from "lucide-react";
import { Input } from "../../components/ui/input";
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
import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateGroupSchema } from "../../lib/schemas";
import AdvancedImageUpload from "../../components/layout/GroupImageUpload";
import { Label } from "../../components/ui/label";

import {
  getGroupIcon,
  groupColors,
  iconOptions,
  isUserOrganizationAdmin,
  isUserOrganizationLeader,
} from "../../utils";
import { GroupTitle } from "./GroupTitle";
import type { GroupDto, UpdateGroupDto } from "../../api/types/group";
import {
  useDeleteGroup,
  useGroup,
  useUpdateGroup,
} from "../../hooks/useGroups";
import { GroupColorSelector } from "../../components/groups/GroupColorSelector";
import { GroupIconSelector } from "../../components/groups/GroupIconSelector";
import { toast } from "sonner";
import { ConfirmActionDialog } from "../../components/common/ConfirmActionDialog";
import { useSelfOrganizationRole } from "../../hooks/useOrganizations";

function GroupNotFound() {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-background flex items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Grupo não encontrado</h2>
          <p className="text-muted-foreground mb-4">
            O grupo que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Grupos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function GroupSettings() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: group, isLoading: isGroupLoading, refetch } = useGroup(id!);
  const { mutateAsync: updateGroup, isPending: isSubmitting } =
    useUpdateGroup();

  const { mutateAsync: deleteGroupAction, isPending: isDeleting } =
    useDeleteGroup();

  const form = useForm<UpdateGroupDto>({
    resolver: zodResolver(updateGroupSchema),
    values: {
      name: group?.name || "",
      description: group?.description || "",
      color: group?.color || "",
      icon: group?.icon || "",
      organizationId: group?.organizationId,
    },
  });
  const { data: userRole, isLoading: roleLoading } = useSelfOrganizationRole(
    group?.organizationId
  );

  const isUserAdminOrLeader =
    isUserOrganizationAdmin(userRole?.role) ||
    isUserOrganizationLeader(userRole?.role);

  const onSubmit = async (data: UpdateGroupDto) => {
    if (!id) return;
    console.log(data);
    try {
      await updateGroup({ id, payload: data });

      refetch();

      toast.success("Configurações do grupo salvo com sucesso.");
    } catch (error) {
      console.log(error);
      // Error handling is done in the parent component/hook
    }
  };

  async function deleteGroup(group: GroupDto) {
    try {
      const { organizationId } = group;
      await deleteGroupAction(group.id);
      toast.success("Grupo removido com sucesso");

      navigate(`/organizations/${organizationId}`);
    } catch (error) {
      toast.error("Falha ao remover grupo");
    }
  }

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

  if (isGroupLoading || roleLoading) {
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

  if (!group) {
    return <GroupNotFound />;
  }

  return (
    <div className="w-full">
      {/* Header */}

      <Button
        variant="ghost"
        onClick={() => navigate(`/groups/${group.id}`)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar à página de Grupos
      </Button>

      <section className="mb-2">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <GroupTitle group={group} />
          </div>
        </div>
      </section>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
          className="space-y-4 max-w-5xl"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Dados do Grupo</CardTitle>
              <CardDescription>
                Altere as principais configurações do grupo
              </CardDescription>
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
            <CardContent className="flex flex-col gap-4 items-start">
              <div className="flex gap-8">
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
                </div>

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
                </div>
              </div>
              <AdvancedImageUpload
                labelText="Imagem da capa do Grupo"
                className="lg:max-w-md"
              />
            </CardContent>
          </Card>
          <div className="flex justify-between">
            <ConfirmActionDialog
              title="Apagar Grupo"
              description="Esta ação é irreversível"
              onConfirm={() => deleteGroup(group)}
              variant="destructive"
              confirmLabel={isDeleting ? "Apagando..." : "Apagar"}
              trigger={
                <Button variant={"destructive"} disabled={!isUserAdminOrLeader}>
                  <Trash2 />
                  Apagar Grupo
                </Button>
              }
            >
              <p className="mb-2 text-neutral-800">
                Tudo isso será apagado também:
              </p>
              <ul className="list-disc ml-5 text-neutral-800">
                <li>Histórico de todas as escalas feitas</li>
                <li>Atividades e interações entre membros</li>
              </ul>
            </ConfirmActionDialog>

            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => navigate(-1)}
                variant={"outline"}
                disabled={isSubmitting || !isUserAdminOrLeader}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || !isUserAdminOrLeader}
              >
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
