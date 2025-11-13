import z from "zod";

export const createGroupSchema = z.object({
  organizationId: z.string(),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const updateGroupSchema = z.object({
  name: z.string().max(100, "Nome muito longo").optional(),
  description: z.string().max(500, "Descrição muito longa").optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});
