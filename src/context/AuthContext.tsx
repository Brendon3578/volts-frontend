import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthState } from "../models/auth";
import type { User } from "../models/models";
import { clearAuthData, isAuthenticated } from "../api/auth";

// Valor inicial do contexto
const initialState: AuthState = {
  user: null,
  token: null,
  expiresAt: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Criando o contexto
export const AuthContext = createContext<{
  state: AuthState;
  login: (token: string, user: User, expiresAt: string) => void;
  logout: () => void;
}>({
  state: initialState,
  login: () => {},
  logout: () => {},
});

// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);

// Provider do contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Efeito para carregar dados de autenticação do localStorage
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const token = localStorage.getItem("auth_token");
        const userJson = localStorage.getItem("auth_user");
        const expiresAt = localStorage.getItem("auth_expires_at");

        if (token && userJson && expiresAt && isAuthenticated()) {
          const user = JSON.parse(userJson) as User;
          setState({
            user,
            token,
            expiresAt,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // Se não houver dados válidos, limpar localStorage
          clearAuthData();
          setState({
            ...initialState,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados de autenticação:", error);
        clearAuthData();
        setState({
          ...initialState,
          isLoading: false,
          error: "Erro ao carregar dados de autenticação",
        });
      }
    };

    loadAuthData();
  }, []);

  // Função para fazer login
  const login = (token: string, user: User, expiresAt: string) => {
    setState({
      user,
      token,
      expiresAt,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  };

  // Função para fazer logout
  const logout = () => {
    clearAuthData();
    setState({
      ...initialState,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
