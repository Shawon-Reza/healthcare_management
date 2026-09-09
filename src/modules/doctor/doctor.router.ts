import {  Router } from "express";
import { doctorController } from "./doctor.controller";
import { createDoctorProfilePayloadSchema } from "./zod.schema";
import { validateRequest } from "../../shared/catchAsync";

export const doctorRouter = Router();





doctorRouter.post("/createDoctorProfile", validateRequest(createDoctorProfilePayloadSchema), doctorController.createDoctorProfile);



doctorRouter.get("/details", doctorController.getDoctorAllDetails);
doctorRouter.get("/", doctorController.getAllDoctors);