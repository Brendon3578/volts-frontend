import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthState } from "../../models/auth";
import type { User } from "../../models/models";
import { AuthContext } from "./AuthContext";
import {
  clearAuthData,
  isAuthenticated,
} from "../../api/endpoints/authEndpoints";

const initialState: AuthState = {
  user: null,
  token: null,
  expiresAt: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

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
          clearAuthData();
          setState({ ...initialState, isLoading: false });
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

  const logout = () => {
    clearAuthData();
    setState({ ...initialState, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
