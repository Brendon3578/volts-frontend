import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { useMe, useUpdateUserProfile } from "../../hooks/useUser";
import { updateUserProfileSchema } from "../../lib/schemas";
import type { UpdateUserProfileDto } from "../../models/user";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";

import { GenderOptions } from "../../models";
import { formatToSimpleDateOnly } from "../../utils/dateHelper";
import { Skeleton } from "../../components/ui/skeleton";

export function ProfilePage() {
  const { data: me, isLoading } = useMe();
  const { mutateAsync: updateProfile, isPending } = useUpdateUserProfile();

  const form = useForm<UpdateUserProfileDto>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: me?.name ?? "",
      phone: me?.phone ?? "",
      bio: me?.bio ?? "",
      birthdate: me?.birthdate ? formatToSimpleDateOnly(me.birthdate) : "",
      gender: me?.gender ?? "", // ver isso aqui
      email: me?.email ?? "",
    },
    values: {
      name: me?.name ?? "",
      phone: me?.phone ?? "",
      bio: me?.bio ?? "",
      birthdate: me?.birthdate ? formatToSimpleDateOnly(me.birthdate) : "",
      gender: me?.gender ?? "",
      email: me?.email ?? "",
    },
  });

  async function onSubmit(data: UpdateUserProfileDto) {
    try {
      if (data.gender == "") {
        // gambiarra pra manter o antigo se não estiver selecionado
        data.gender = me?.gender;
      }
      await updateProfile(data);
      toast.success("Perfil atualizado");
    } catch {
      toast.error("Falha ao atualizar perfil");
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-2xl font-poppins">Meu Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex w-full gap-4 *:w-full">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="h-10 w-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="h-24 w-full" />

            <div className="flex justify-end">
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-2xl font-poppins">Meu Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex w-full gap-4 *:w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
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
                          placeholder="joao@email.com"
                          disabled
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gênero</FormLabel>

                      <FormControl>
                        <select
                          className="placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        >
                          <option value="">Selecione o novo gênero...</option>
                          {GenderOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Conte um pouco sobre você"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={isPending || isLoading}>
                  {isPending ? "Salvando..." : "Salvar alterações"}
                  <Save />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
