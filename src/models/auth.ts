import type { User } from "./models";

// Tipos para requisições de autenticação
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthdate: string;
  acceptedTerms: boolean;
  gender: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Tipos para respostas de autenticação
export interface AuthResponse {
  message: string;
  data: {
    token: string;
    expiresAt: string;
    user: User;
  };
}

// Tipo para o contexto de autenticação
export interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Tipo para o formulário de login
export interface LoginForm {
  email: string;
  password: string;
}

// Tipo para o formulário de registro
export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}
