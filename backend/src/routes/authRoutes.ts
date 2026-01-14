import { Router } from "express";
import { getMe, login, logout, register } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);   // register new user
router.post("/login", login);   // log in existing user
router.post("/logout", logout);   // logout out current user
router.get("/me", protect, getMe);   // fetches current user

export default router;
