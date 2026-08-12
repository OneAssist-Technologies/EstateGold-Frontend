"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "buyer" | "seller" | "agent" | "admin";
  roles?: string[];
  isVerified?: boolean;
  isActive?: boolean;
  verificationStatus?: "none" | "pending" | "approved" | "rejected";
  rejectionReason?: string;
  experience?: string;
  agencyName?: string;
  reraNumber?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (
    user: User,
    token: string
  ) => void;

  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
          setUser(JSON.parse(storedUser));
        }

        if (token) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/get-profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              setUser(data.user);
              localStorage.setItem("user", JSON.stringify(data.user));
            }
          } else if (response.status === 401 || response.status === 403) {
            // Token expired or invalid
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
          }
        }
      } catch (error) {
        console.warn("Auth check network error (backend may be initializing):", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: User, token: string) => {
    if (userData && token) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (e) {
      console.error("Refresh user error:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated:
          !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}