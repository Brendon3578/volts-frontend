import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  useOrganizationCompleteViewById,
  useUpdateOrganization,
  useDeleteOrganization,
  useOrganizationMembers,
  useChangeOrganizationMemberRole,
  useInviteOrganizationMember,
  useRemoveOrganizationMember,
} from "../../hooks/useOrganizations";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Dialog } from "../../components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import type {
  UpdateOrganizationDto,
  InviteOrganizationMemberDto,
} from "../../models/organization";
import { ConfirmActionDialog } from "../../components/common/ConfirmActionDialog";
import { OrganizationRole } from "../../models/constants";
import type { OrganizationRoleType } from "../../models";
import { OrganizationMemberRow } from "../../components/layout/organization/OrganizationMemberRow";
import { isUserOrganizationLeader } from "./../../utils/constantsHelper";
import { useAuth } from "../../context/Auth/useAuth";
import axios, { isAxiosError } from "axios";
import { Textarea } from "../../components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrganizationSchema } from "../../lib/schemas";
import { ArrowLeft } from "lucide-react";

export function OrganizationSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: organization,
    isLoading: isOrgLoading,
    isError: isOrgError,
    refetch,
  } = useOrganizationCompleteViewById(id);
  const { data: members } = useOrganizationMembers(id);

  const { mutateAsync: updateOrganization, isPending: isUpdating } =
    useUpdateOrganization();
  const { mutateAsync: deleteOrganization, isPending: isDeleting } =
    useDeleteOrganization();
  const { mutateAsync: inviteMember, isPending: isInviting } =
    useInviteOrganizationMember();

  const { state } = useAuth();
  const user = state.user;

  const form = useForm<UpdateOrganizationDto>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      description: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (organization) {
      form.reset({
        name: organization.name || "",
        description: organization.description || "",
        email: organization.email || "",
        phone: organization.phone || "",
        address: organization.address || "",
      });
    }
  }, [organization]);

  const onSubmit = async (data: UpdateOrganizationDto) => {
    try {
      if (!id) return;
      await updateOrganization({ id, payload: data });
      toast.success("Organização atualizada");
      refetch();
    } catch {
      toast.error("Falha ao atualizar organização");
    }
  };

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>(OrganizationRole.MEMBER);

  const handleInvite = async () => {
    try {
      if (!id || !inviteEmail) return;
      const payload: InviteOrganizationMemberDto = {
        invitedEmail: inviteEmail,
        inviterRole: inviteRole,
      };
      await inviteMember({ organizationId: id, payload });
      toast.success("Convite enviado");
      setInviteEmail("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.error("Usuário não encontrado!");
          return;
        }
      }
      toast.error("Falha ao enviar convite");
    }
  };

  const handleDeleteOrganization = async () => {
    try {
      if (!id) return;
      await deleteOrganization(id);
      toast.success("Organização apagada");
      navigate("/organizations");
    } catch {
      toast.error("Falha ao apagar organização");
    }
  };

  const roleOptions = useMemo(() => Object.keys(OrganizationRole), []);

  if (user == null) {
    navigate("/login?error=unauthorized");
    return;
  }

  if (isOrgLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Informações da Organização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input disabled placeholder="Nome" />
              <Input disabled placeholder="Email" />
              <Input disabled placeholder="Telefone" />
              <Input disabled placeholder="Endereço" />
              <Input disabled placeholder="Descrição" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isOrgError || !organization || !id) {
    return (
      <div className="container mx-auto p-4">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Organização não encontrada</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        onClick={() => navigate(`/organizations/${organization.id}`)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar à Página de Organização
      </Button>

      <div className="space-y-6">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">
              Informações da Organização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: ONG Saúde e Vida, Empresa Systems"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="systems@ong.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 98765-4321" {...field} />
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
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Av. Fictícia 120" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva o propósito e atividades da organização..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <ConfirmActionDialog
                    title="Apagar organização"
                    description="Esta ação é irreversível"
                    onConfirm={handleDeleteOrganization}
                    variant="destructive"
                    confirmLabel={isDeleting ? "Apagando..." : "Apagar"}
                  >
                    <Button variant="destructive">Apagar</Button>
                  </ConfirmActionDialog>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-xl">Membros da Organização</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members?.map((m) => (
                  <OrganizationMemberRow
                    key={m.id}
                    member={m}
                    organizationId={organization.id}
                    currentUserRole={organization.currentUserOrganizationRole}
                    currentUserId={user.id}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Convidar Novo Membro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Select
                value={inviteRole}
                onValueChange={(value) => setInviteRole(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Cargo" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleInvite}
                disabled={isInviting || !inviteEmail}
              >
                Enviar Convite
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog></Dialog>
      </div>
    </div>
  );
}
