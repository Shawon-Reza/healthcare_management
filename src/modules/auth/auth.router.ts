import { Router } from "express";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Role } from "../../generated/prisma/enums";

export const authRouter = Router();


authRouter.post("/signup", authController.signUp);
authRouter.post("/signIn", authController.signIn);



authRouter.get("/newTokens", authMiddleware([Role.ADMIN, Role.DOCTOR, Role.SUPER_ADMIN, Role.PATIENT]), authController.newTokonFromRefreshToken);

