import { useState, type ReactNode } from "react";
import type { User } from "../types/user";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
  };
  const logout = () => {
    sessionStorage.removeItem("access_token");
    setUser(null);
  };
  const value = {
    user,
    login,
    logout,
    isLoggedIn: user !== null,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
