import { useMutation } from '@tanstack/react-query';
import { register, saveAuthData } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import type { RegisterRequest } from '../models/auth';

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