import React, { createContext, useContext, useState, useEffect } from "react";
import { getApiUrl } from "../api/client";

export interface AdminUser {
  id: string;
  email: string;
  role: "ADMIN" | "PLAYER" | string;
  ign?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("lordz_admin_token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("lordz_admin_token");

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(getApiUrl("/auth/me"), {
          headers: { Authorization: `Bearer ${storedToken}` },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user && ["ADMIN", "SUPER_ADMIN", "TOURNAMENT_ADMIN", "CONTENT_EDITOR"].includes(data.user.role)) {
            setUser(data.user);
            localStorage.setItem("lordz_admin_user", JSON.stringify(data.user));
          } else {
            localStorage.removeItem("lordz_admin_token");
            localStorage.removeItem("lordz_admin_user");
            setToken(null);
            setUser(null);
          }
        } else {
          localStorage.removeItem("lordz_admin_token");
          localStorage.removeItem("lordz_admin_user");
          setToken(null);
          setUser(null);
        }
      } catch {
        localStorage.removeItem("lordz_admin_token");
        localStorage.removeItem("lordz_admin_user");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (newToken: string, newUser: AdminUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("lordz_admin_token", newToken);
    localStorage.setItem("lordz_admin_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("lordz_admin_token");
    localStorage.removeItem("lordz_admin_user");
    fetch(getApiUrl("/auth/logout"), { method: "POST", credentials: "include" }).catch(() => {});
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
