import { Router } from "express";
import { doctorController } from "./doctor.controller";

export const doctorRouter = Router();


doctorRouter.post("/createDoctorProfile", doctorController.createDoctorProfile);
doctorRouter.get("/details", doctorController.getDoctorAllDetails);