import z from "zod";
import { Gender } from "../../models/constants";

export const loginFormSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const signupFormSchema = z
  .object({
    fullName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.email("Email inválido"),
    birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
    gender: z.enum(
      [Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.PREFER_NOT_TO_SAY],
      { error: () => ({ message: "Gênero inválido" }) }
    ),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Digite a senha novamente"),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "Você precisa aceitar os termos",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupFormSchema>;
