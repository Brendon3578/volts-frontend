import { Button } from "../../components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import logoImage from "../../assets/Volts_lg.png";
import logoName from "../../assets/Volts_lg_name.png";
import googleIcon from "../../assets/icons/google.svg";
import { useForm } from "react-hook-form";
import type { LoginForm } from "../../models/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "../../lib/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useLogin } from "../../hooks/useLogin";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const navigate = useNavigate();
  const login = useLogin();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    login.mutate(data, {
      onSuccess: () => {
        toast.success("Login realizado com sucesso!");
        // Delay navigation to allow toast to show
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      },
      onError: (error) => {
        toast.error("Falha ao fazer login. E-mail ou senha incorretos!");
        console.log(error);
        //console.error("Erro de login:", error);
      },
    });
  };

  return (
    <Form {...form}>
      <form
        className={"flex flex-col gap-6"}
        onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex gap-4 items-center">
              <img src={logoImage} alt="" className="size-18 object-contain" />
              <img src={logoName} alt="" className="h-9" />
            </div>
            <h1 className="text-2xl xl:text-3xl font-bold">
              Entre na sua conta
            </h1>
            <p className="text-muted-foreground text-sm xl:text-base text-balance">
              Entre com o seu email e senha para continuar
            </p>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao@email.com"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="">
                <div className="flex items-center justify-between">
                  <FormLabel htmlFor="password">Senha</FormLabel>
                  <a href="#" className="ml-auto text-sm  hover:underline">
                    Esqueceu sua senha?
                  </a>
                </div>
                <FormControl>
                  <Input id="password" type="password" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Field>
            <Button type="submit" disabled={login.isPending}>
              {login.isPending ? "Entrando..." : "Entrar"}
            </Button>
          </Field>

          <FieldSeparator>Ou entre com</FieldSeparator>
          <Field>
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                toast.warning("Conexão com o Google não realizada")
              }
            >
              <img src={googleIcon} alt="Ícone do google" className="size-4" />
              Entrar com o Google
            </Button>

            <FieldDescription className="text-center">
              Não tem uma conta?{" "}
              <a
                href="/sign-up"
                className="p-4 pl-0 underline underline-offset-4 text-neutral-800"
              >
                Cadastre-se
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
