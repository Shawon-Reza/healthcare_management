import { Router } from "express";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Role } from "../../generated/prisma/enums";

export const authRouter = Router();


authRouter.post("/signup", authController.signUp);
authRouter.post("/signIn", authController.signIn);
authRouter.post("/signOut", authController.signOut);
authRouter.patch("/updatePassword", authController.updatePassword);

authRouter.post("/reset-password", authController.resetPassword);
authRouter.post("/reset_password_with_otp", authController.reset_password_with_otp);

// ---------------- Google Sign In ----------------
authRouter.get("/googleSignIn", authController.googleSignIn);
authRouter.get("/googleSignIn/success", authController.googleSignInSuccess);


authRouter.get("/newTokens", authMiddleware([Role.ADMIN, Role.DOCTOR, Role.SUPER_ADMIN, Role.PATIENT]), authController.newTokonFromRefreshToken);


