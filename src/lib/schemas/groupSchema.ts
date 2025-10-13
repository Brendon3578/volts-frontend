import z from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
  color: z.string().optional(),
  imageUrl: z.url("URL Inválida").optional(),
  icon: z.string().optional(),
});
