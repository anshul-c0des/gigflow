import jwt from "jsonwebtoken";
import { AuthUser } from "../types/auth";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }
  return secret;
};

export const signToken = (payload: AuthUser) => {
  return jwt.sign(payload, getSecret(), { expiresIn: "1d" });
};

export const verifyToken = <T>(token: string): T | null => {
  try {
    return jwt.verify(token, getSecret()) as T;
  } catch (err) {
    console.error(err);
    return null;
  }
};
