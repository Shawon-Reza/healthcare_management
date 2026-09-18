import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { createDoctorProfilePayloadSchema } from "./zod.schema";
// import { zodValidationFN } from "../../shared/catchAsync";
import { authMiddleware } from "../../middleware/authMiddleware";
import { zodValidationFN } from "../../middleware/validateRequest";

export const doctorRouter = Router();





doctorRouter.post(
    "/createDoctorProfile",
    authMiddleware(["ADMIN", "SUPER_ADMIN"]),
    zodValidationFN(createDoctorProfilePayloadSchema),
    doctorController.createDoctorProfile
);



doctorRouter.get("/details", doctorController.getDoctorAllDetails);
doctorRouter.get("/", doctorController.getAllDoctors);