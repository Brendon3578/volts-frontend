import z from "zod";
import { Gender } from "../../models";

export const updateUserProfileSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  birthdate: z.iso
    .date("Data de nascimento inválida")
    .min(1, "Data de nascimento é obrigatória")
    .optional(),
  gender: z
    .enum(
      [Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.PREFER_NOT_TO_SAY],
      { error: () => ({ message: "Gênero inválido" }) }
    )
    .or(z.string().optional()),
});
