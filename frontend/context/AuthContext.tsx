"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/axios";
import { loginUser, registerUser } from "@/services/authService";
import { useRouter } from "next/navigation";
import { connectSocket} from "@/lib/socket";
import toast from "react-hot-toast";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "freelancer";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: "owner" | "freelancer" }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;
  
    const socket = connectSocket();
  
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
  
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  
    return () => {
      socket.disconnect();
    };
  }, [user]);
  

  const login = async (email: string, password: string) => {
    const res = await loginUser({ email, password });
    setUser(res.data.user);
    toast.success("Logged in successfully");
    return res.data.user;
  };
  
  const register = async (data: { name: string; email: string; password: string; role: "owner" | "freelancer" }) => {
    const res = await registerUser(data);
    setUser(res.data.user);
    toast.success("Registered successfully");
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setUser(null);
      toast.success("Logged out successfully")
      router.push('/')
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
