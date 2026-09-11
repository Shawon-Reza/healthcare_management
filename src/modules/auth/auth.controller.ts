import { Request, Response } from "express";
import { catchAsyncError } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import status from "http-status";
import { tokenUtils } from "../utils/token";


const signUp = catchAsyncError(
    async (req: Request, res: Response) => {

        const result = await authService.signUp(req.body);
        tokenUtils.setAccessTokenCookie(res, "accessToken", result.accessToken);
        tokenUtils.setRefreshTokenCookie(res, "refreshToken", result.refreshToken);
        res.status(201).json({
            success: true,
            message: "User signed up successfully.",
            data: result
        });

    }
)

const signIn = catchAsyncError(
    async (req: Request, res: Response) => {
     
        const { email, password } = req.body;

        const result = await authService.signIn(email, password);

        //  ---------------- set cookies ----------------
        tokenUtils.setAccessTokenCookie(res, "accessToken", result.accessToken);
        tokenUtils.setRefreshTokenCookie(res, "refreshToken", result.refreshToken);


        res.status(200).json({
            success: true,
            status: status.OK,
            message: "User signed in successfully.",
            data: result
        });

    }

)





export const authController = {
    signUp,
    signIn,
};