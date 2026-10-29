import { useEffect, useState, type ReactNode } from "react";
import type { User } from "../types/user";
import { AuthContext } from "./AuthContext";
import { getCurrentUser } from "../apis/userApi";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (user: User) => {
    setUser(user);
  };
  const logout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    setUser(null);
  };
  const value = {
    user,
    login,
    logout,
    isLoggedIn: user !== null,
    loading,
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await getCurrentUser();
        setUser(me);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
