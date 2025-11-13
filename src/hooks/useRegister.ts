import { useMutation } from "@tanstack/react-query";
import { register, saveAuthData } from "../api/endpoints/authEndpoints";
import type { RegisterRequest } from "../models/auth";
import { useAuth } from "../context/Auth/useAuth";

export function useRegister() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (response) => {
      const { token, user, expiresAt } = response.data;

      // Salvar dados no localStorage
      saveAuthData(response.data);

      // Atualizar o contexto de autenticação
      login(token, user, expiresAt);
    },
  });
}
