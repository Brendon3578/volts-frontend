import api from "./client";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../models/auth";

// Função para registrar um novo usuário
export const register = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/Auth/register", data);
  return response.data;
};

// Função para fazer login
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/Auth/login", data);
  return response.data;
};

// Função para obter o usuário atual
export const getCurrentUser = async (): Promise<
  AuthResponse["data"]["user"]
> => {
  const response = await api.get<AuthResponse>("/User/me");
  return response.data.data.user;
};

// Função para salvar dados de autenticação no localStorage
export const saveAuthData = (authData: AuthResponse["data"]): void => {
  localStorage.setItem("auth_token", authData.token);
  localStorage.setItem("auth_user", JSON.stringify(authData.user));
  localStorage.setItem("auth_expires_at", authData.expiresAt);
};

// Função para limpar dados de autenticação do localStorage
export const clearAuthData = (): void => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  localStorage.removeItem("auth_expires_at");
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("auth_token");
  const expiresAt = localStorage.getItem("auth_expires_at");

  if (!token || !expiresAt) {
    return false;
  }

  // Verificar se o token expirou
  const expirationDate = new Date(expiresAt);
  const now = new Date();

  return now < expirationDate;
};
