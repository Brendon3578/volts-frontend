import { useMutation } from "@tanstack/react-query";
import { login as loginApi, saveAuthData } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import type { LoginRequest } from "../models/auth";

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: LoginRequest) => loginApi(data),
    onSuccess: (response) => {
      const { token, user, expiresAt } = response.data;

      // Salvar dados no localStorage
      saveAuthData(response.data);

      // Atualizar o contexto de autenticação
      login(token, user, expiresAt);
    },
  });
}
