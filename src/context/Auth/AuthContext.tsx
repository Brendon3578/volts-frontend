import { createContext } from "react";
import type { AuthState } from "../../models/auth";
import type { User } from "../../models/models";

// TODO: refazer login com refresh token
const initialState: AuthState = {
  user: null,
  token: null,
  expiresAt: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export interface AuthContextType {
  state: AuthState;
  login: (token: string, user: User, expiresAt: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  state: initialState,
  login: () => {},
  logout: () => {},
});
