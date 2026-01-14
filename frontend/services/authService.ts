import api from "@/lib/axios";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "owner" | "freelancer";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = (data: RegisterPayload) =>
  api.post("/auth/register", data); 

export const loginUser = (data: LoginPayload) =>
  api.post("/auth/login", data);
