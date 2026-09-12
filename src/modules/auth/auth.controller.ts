import { Request, Response } from "express";
import { catchAsyncError } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import status from "http-status";
import { tokenUtils } from "../utils/token";
import { env } from "../../config/env";
import { cookiesUtils } from "../utils/cookies";


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
        tokenUtils.setBetterAuthTokenCookie(res, "better-auth.session_token", result.token);

        res.status(200).json({
            success: true,
            status: status.OK,
            message: "User signed in successfully.",
            data: result
        });

    }

)

const newTokonFromRefreshToken = catchAsyncError(
    async (req: Request, res: Response) => {

        const refreshToken = req.cookies["refreshToken"];
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];
        const result = await authService.newTokonFromRefreshToken(betterAuthSessionToken, refreshToken, req.user);



        cookiesUtils.setCookie(res, "accessToken", result.accessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 1000 // 1 day
        });
        cookiesUtils.setCookie(res, "refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 1000 // 1 day
        });
        cookiesUtils.setCookie(res, "better-auth.session_token", result.betterAuthTokenUpdate.token, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 1000 // 1 day
        });


        res.status(200).json({
            status: status.OK,
            success: true,
            message: "New tokens generated successfully.",
            data: result
        });
    }
)


const signOut = catchAsyncError(
    async (req: Request, res: Response) => {
        const token = req.cookies["better-auth.session_token"];
        const result = await authService.signOut(token);

        console.log("Sign out result:", result);
        // Clear cookies
        cookiesUtils.clearCookie(res, "accessToken", {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
        }
        );
        cookiesUtils.clearCookie(res, "refreshToken", {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
        }
        );
        cookiesUtils.clearCookie(res, "better-auth.session_token", {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
        }
        );


        res.status(200).json({
            status: status.OK,
            success: true,
            message: "User signed out successfully.",
        });
    }
)

const updatePassword = catchAsyncError(
    async (req: Request, res: Response) => {
        // const { currentPassword, newPassword } = req.body;

        // await authService.updatePassword(req.user.id, currentPassword, newPassword);

        res.status(200).json({
            status: status.OK,
            success: true,
            message: "Password updated successfully.",
        });
    }
)


export const authController = {
    signUp,
    signIn,
    newTokonFromRefreshToken,
    signOut,
    updatePassword

};