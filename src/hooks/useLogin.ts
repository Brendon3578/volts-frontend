import { useMutation } from "@tanstack/react-query";
import {
  login as loginApi,
  saveAuthData,
} from "../api/endpoints/authEndpoints";
import type { LoginRequest } from "../models/auth";
import { useAuth } from "../context/Auth/useAuth";

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
