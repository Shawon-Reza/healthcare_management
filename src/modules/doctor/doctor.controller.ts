import { Request, Response } from "express";
import { catchAsyncError } from "../../shared/catchAsync"
import status from "http-status";
import { doctorServices } from "./doctor.service";



const createDoctorProfile = catchAsyncError(async (req: Request, res: Response,) => {
    console.log("Controler", req.body)
    const result = await doctorServices.createDoctorProfile(req.body);
    res.status(201).json({
        status: status.CREATED,
        success: true,
        data: result
    })

})

const getDoctorAllDetails = catchAsyncError(
    async (req: Request, res: Response,) => {
        const result = await doctorServices.getDoctorAllDetails(req.query.doctorId as string);
        res.status(200).json({
            status: status.OK,
            success: true,
            data: result
        })
    }
)



export const doctorController = {
    createDoctorProfile,
    getDoctorAllDetails
}