import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signupFormSchema,
  type SignupFormData,
} from "@/lib/schemas/authFormSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import logoImage from "@/assets/Volts_lg.png";
import logoName from "@/assets/Volts_lg_name.png";
import { Link, useNavigate } from "react-router-dom";
import { GenderOptions } from "@/models/constants";
import { ArrowLeft } from "lucide-react";
import { useRegister } from "../../hooks/useRegister";
import axios from "axios";
import type { RegisterRequest } from "../../models/auth";

export function SignUp() {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      //fullName: "",
      //email: "",
      //birthDate: "",
      //gender: undefined,
      //password: "",
      //confirmPassword: "",
      //termsAccepted: false,

      fullName: "Brendon Gomes",
      email: "teste@teste.com",
      birthDate: "2010-10-10",
      gender: "male",
      password: "1234567", // placeholder password ignore it
      confirmPassword: "1234567",
      termsAccepted: true,
    },
  });

  const navigate = useNavigate();
  const { mutate: registerMutate, isPending } = useRegister();

  const onSubmit = async (data: SignupFormData) => {
    const registerData: RegisterRequest = {
      name: data.fullName,
      email: data.email,
      password: data.password,
      acceptedTerms: data.termsAccepted,
      birthdate: data.birthDate,
      confirmPassword: data.confirmPassword,
      gender: data.gender,
    };

    registerMutate(registerData, {
      onSuccess: () => {
        toast.success("Cadastro realizado com sucesso!");
        navigate("/dashboard");
      },
      onError: (error) => {
        let errorMessage = "";
        if (axios.isAxiosError(error)) {
          const errorData = error.response?.data;
          console.log(errorData);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        }
        toast.error(`Erro ao realizar cadastro ${errorMessage}`);
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-sky-700 via-blue-500 to-sky-300 p-6">
      <div className="w-full max-w-lg bg-neutral-50 backdrop-blur-sm border border-neutral-50/10 rounded-xl shadow-2xl p-8 ">
        <div className="flex flex-col items-center gap-1 text-center mb-8 ">
          <Link
            to="/login"
            className="flex items-center gap-2 text-neutral-600 hover:text-primary underline transition-colors duration-150 w-fit self-start"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
          <div className="flex gap-4 items-center">
            <img src={logoImage} alt="" className="size-18 object-contain" />
            <img src={logoName} alt="" className="h-9" />
          </div>
          <h1 className="text-2xl xl:text-3xl font-bold text-neutral-800">
            Criar nova conta
          </h1>
          <p className="text-neutral-600 text-sm xl:text-base">
            Preencha seus dados para começar
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="João da Silva" {...field} />
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="birthDate"
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GenderOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirme sua senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Aceito os
                        <a
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          termos de uso e política de privacidade
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Criando conta..." : "Criar conta"}
            </Button>

            <p className="text-center text-sm text-neutral-700">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="text-neutral-700 hover:text-primary underline"
              >
                Faça login
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
