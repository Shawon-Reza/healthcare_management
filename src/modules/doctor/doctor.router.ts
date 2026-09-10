import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { createDoctorProfilePayloadSchema } from "./zod.schema";
import { validateRequest } from "../../shared/catchAsync";
import { authMiddleware } from "../../middleware/authMiddleware";

export const doctorRouter = Router();






doctorRouter.post("/createDoctorProfile", authMiddleware(["ADMIN","SUPER_ADMIN"]), validateRequest(createDoctorProfilePayloadSchema), doctorController.createDoctorProfile);



doctorRouter.get("/details", doctorController.getDoctorAllDetails);
doctorRouter.get("/", doctorController.getAllDoctors);