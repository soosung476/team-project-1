import { createContext, useContext } from "react";
import type { User } from "../types/user";

// id , password, isLogin, login(), logout()
type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Context is null");
  }
  return context;
}
