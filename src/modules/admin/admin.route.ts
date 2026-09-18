import { Router } from "express";
import { adminController } from "./admin.controllers";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Role } from './../../generated/prisma/enums';



export const adminRouter = Router();




adminRouter.post("/createAdmin",
    authMiddleware([Role.ADMIN, Role.SUPER_ADMIN]), adminController.createAdmin);

adminRouter.delete("/:id", authMiddleware([Role.ADMIN, Role.SUPER_ADMIN]), adminController.deleteAdmin);


adminRouter.get("/", authMiddleware([Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR]), adminController.getAllAdmins);
adminRouter.get("/:id", authMiddleware([Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR]), adminController.getAdminById);


adminRouter.patch("/:id", authMiddleware([Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR]), adminController.updateAdmin);