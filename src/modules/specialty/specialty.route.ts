import { Router } from "express";
import { specialtyController } from "./specialty.controller";

export const specialityRouter = Router();

specialityRouter.post("/", specialtyController.createSpecialty);
specialityRouter.get("/", specialtyController.allSpecialty); 
specialityRouter.delete("/", specialtyController.deleteSpecialty); 


