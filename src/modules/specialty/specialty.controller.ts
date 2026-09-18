import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";
import { catchAsyncError } from "../../shared/catchAsync";




const createSpecialty = catchAsyncError(
    async (req: Request, res: Response) => {

        console.log("From specialty.controller.ts - Request Body:", req.body, );
        

        const result = await specialtyService.createSpecialty(req.body);

        res.status(201).json({
            success: true,
            message: "Specialty created successfully.",
            data: result
        });

    }
)

const allSpecialty = catchAsyncError(
    async (req: Request, res: Response) => {
        const result = await specialtyService.allSpecialty();
        res.status(200).json({
            success: true,
            message: "Specialties fetched successfully.",
            data: result
        });
    }
)

const deleteSpecialty = catchAsyncError(

    async (req: Request, res: Response) => {


        const result = await specialtyService.deleteSpecialty(req.query.id as string, req.query.title as string);
        res.status(200).json({
            success: true,
            message: "Specialty deleted successfully.",
            data: result
        });
    }
)





export const specialtyController = {
    createSpecialty,
    allSpecialty,
    deleteSpecialty
};