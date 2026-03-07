import express from "express";
import {
    registerSuperAdmin,
    login,
    refresh,
    logout,
    logoutAll,
    getMe,
    changePassword,
} from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import {
    registerValidation,
    loginValidation,
} from "../middlewares/validation.js";

const router = express.Router();

// Public routes
router.post("/register-superadmin", ...registerValidation, registerSuperAdmin);
router.post("/login", ...loginValidation, login);
router.post("/refresh", refresh);

// Protected routes
router.post("/logout", protect, logout);
router.post("/logout-all", protect, logoutAll);
router.get("/me", protect, getMe);
router.post("/change-password", protect, changePassword);

export default router;
