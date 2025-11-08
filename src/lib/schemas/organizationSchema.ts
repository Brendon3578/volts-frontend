import z from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
  //color: z.string().optional(),
  //imageUrl: z.url("URL Inválida").optional(),
  //icon: z.string().optional(),
  email: z.email("Email inválido").optional(),
  phone: z.string().max(32, "Telefone muito longo").optional(),
  address: z.string().max(256, "Endereço muito longo").optional(),
});
