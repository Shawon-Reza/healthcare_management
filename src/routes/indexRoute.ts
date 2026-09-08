import { Router } from "express";
import { specialityRouter } from "../modules/specialty/specialty.route";
import { authRouter } from "../modules/auth/auth.router";
import { doctorRouter } from "../modules/doctor/doctor.router";


export const indexRouter = Router();


indexRouter.use("/specialties",specialityRouter);
indexRouter.use("/auth",authRouter);
indexRouter.use("/doctors", doctorRouter);