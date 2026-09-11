import { Router } from "express";
import { specialityRouter } from "../modules/specialty/specialty.route";
import { authRouter } from "../modules/auth/auth.router";
import { doctorRouter } from "../modules/doctor/doctor.router";
import { adminRouter } from "../modules/admin/admin.route";
import { superAdminRouter } from "../modules/superAdmin/superAdmin.router";


export const indexRouter = Router();

indexRouter.use("/super_admin", superAdminRouter);
indexRouter.use("/admin", adminRouter);
indexRouter.use("/doctors", doctorRouter);

indexRouter.use("/auth", authRouter);

indexRouter.use("/specialties", specialityRouter);


