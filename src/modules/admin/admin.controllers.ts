import { Request, Response } from "express"
import { catchAsyncError } from "../../shared/catchAsync"
import { adminService } from "./admin.services";
import status from "http-status";
import { cookiesUtils } from "../utils/cookies";

const createAdmin = catchAsyncError(async (req: Request, res: Response) => {

    const payload = req.body;
    const result = await adminService.createAdmin(payload);
    res.
        status(201).
        json({
            status: status.CREATED,
            success: true,
            message: "Admin created successfully",
            data: result
        })

})

const getAllAdmins = catchAsyncError(async (req: Request, res: Response) => {
    const result = await adminService.getAllAdmins();
    if (!result) {
        return res.status(404).json({
            status: status.NOT_FOUND,
            success: false,
            message: "No admins found",
            data: null
        });
    }
    res.status(200).json({
        status: status.OK,
        success: true,
        message: "Admins retrieved successfully",
        data: result
    });
});

const getAdminById = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.getAdminById(id as string);

    if (!result) {
        return res.status(404).json({
            status: status.NOT_FOUND,
            success: false,
            message: "Admin not found",
            data: null
        });
    }
    res.status(200).json({
        status: status.OK,
        success: true,
        message: "Admin retrieved successfully",
        data: result
    });
});

const updateAdmin = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    console.log("===============:", req.user);

    if (req.user?.userId !== id) {

        cookiesUtils.clearCookie(res,
            "accessToken",
            {
                httpOnly: true,  // JS can't read
                secure: false,  // true in HTTPS production
                sameSite: "none", // cross-site rule
                maxAge: 60 * 60 * 24 * 1000, // 1day
                path: "/",       // all routes
            }
        );

        cookiesUtils.clearCookie(res, "refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });

        return res.status(403).json({
            status: status.FORBIDDEN,
            success: false,
            message: "You are not allowed to update others profile",
            data: null
        });
    }
    const result = await adminService.updateAdmin(id as string, payload);

    res.status(200).json({
        status: status.OK,
        success: true,
        message: "Admin updated successfully",
        data: result
    });
});

const deleteAdmin = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("Deleting admin with ID:", id);
    const result = await adminService.deleteAdmin(id as string);

    res.status(200).json({
        status: status.OK,
        success: true,
        message: "Admin deleted successfully",
        data: result
    });
});

export const adminController = {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
}