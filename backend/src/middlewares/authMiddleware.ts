import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthUser } from "../types/auth";
import { Types } from "mongoose";

interface AuthRequest extends Request {
  user?: AuthUser;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const payload = verifyToken<{ id: string; role: AuthUser["role"] }>(token);

    if (!payload) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = {
      id: new Types.ObjectId(payload.id),
      role: payload.role,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const ownerOnly = (
  req: Request & { user?: AuthUser },
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "owner") {
    return res.status(403).json({ message: "Owners only" });
  }
  next();
};

export const freelancerOnly = (
  req: Request & { user?: AuthUser },
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "freelancer") {
    return res.status(403).json({ message: "Freelancers only" });
  }
  next();
};
