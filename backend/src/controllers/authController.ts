import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { signToken } from "../utils/jwt";
import { authCookieOptions } from "../utils/cookies";
import { registerSchema, loginSchema } from "../validators/authValidator";
import { AuthUser } from "../types/auth";

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.flatten(),
    });
  }

  const { name, email, password, role } = parsed.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const token = signToken({
    id: user._id,
    role: user.role,
  });

  res
    .status(201)
    .cookie("token", token, authCookieOptions)
    .json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.flatten(),
    });
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials. Please check your email!" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials. Please try again." });
  }

  const token = signToken({
    id: user._id,
    role: user.role,
  });

  res
    .status(200)
    .cookie("token", token, authCookieOptions)
    .json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};

export const getMe = async (req: Request & { user?: AuthUser }, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res
    .status(200)
    .cookie("token", "", {
      ...authCookieOptions,
      expires: new Date(0),
    })
    .json({ message: "Logged out successfully" });
};