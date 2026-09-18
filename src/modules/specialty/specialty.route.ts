import { Router } from "express";
import { specialtyController } from "./specialty.controller";
import { multerUploader } from "../../config/cloudinary";

export const specialityRouter = Router();

specialityRouter.post("/",

    multerUploader.single("file"),
    specialtyController.createSpecialty);

specialityRouter.get("/", specialtyController.allSpecialty);
specialityRouter.delete("/", specialtyController.deleteSpecialty);


