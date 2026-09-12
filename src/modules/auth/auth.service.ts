/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../shared/apErrorClass";
import { jwtUtils } from "../utils/jwtUtils";
import { tokenUtils } from "../utils/token";
import { env } from "../../config/env";


type SignUpPayload = {
    name: string;
    email: string;
    password: string;
};


const signUp = async (payload: SignUpPayload) => {

    const { name, email, password } = payload;
    const result = await auth.api.signUpEmail({
        body: {
            name, email, password
        },
    });

    const accessToken = tokenUtils.createAccessToken({
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        isDeleted: result.user.isDeleted,
        needPasswordChange: result.user.needPasswordChange,

    });
    const refreshToken = tokenUtils.createRefreshToken({
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        isDeleted: result.user.isDeleted,
        needPasswordChange: result.user.needPasswordChange,
    });

    const patient = await prisma.$transaction(async (tx) => {

        try {
            const patientProfile = await tx.patientProfile.create({
                data: {
                    userId: result.user.id,
                    name: result.user.name,
                    email: result.user.email,
                }
            });
            return patientProfile;

        } catch (error) {
            console.error("Error creating patient profile:", error);
            await tx.user.delete({
                where: { id: result.user.id }
            })
            throw error;
        }


    })


    return {
        accessToken,
        refreshToken,
        ...result,
        patient
    };
}


const signIn = async (email: string, password: string) => {
    const result = await auth.api.signInEmail({
        body: {
            email, password
        },
    });

    // --------------------- Access Token and Refresh Token Generation ---------------------
    const accessToken = tokenUtils.createAccessToken({
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        isDeleted: result.user.isDeleted,
        needPasswordChange: result.user.needPasswordChange,

    });
    const refreshToken = tokenUtils.createRefreshToken({
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        isDeleted: result.user.isDeleted,
        needPasswordChange: result.user.needPasswordChange,
    });



    return {
        accessToken,
        refreshToken,
        ...result
    };
}

const newTokonFromRefreshToken = async (betterAuthSessionToken: string, refreshToken: string, user: any) => {
    console.log("Better Auth Session Token in service:", betterAuthSessionToken);
    console.log("Refresh token in service:", refreshToken);
    console.log("User in service:", user);
    try {

        const verifyRefreshToken = jwtUtils.verifyToken(refreshToken, env.REFRESH_TOKEN_SECRET);
        console.log("Verify refresh token:", verifyRefreshToken);

        // --------------------- Access Token and Refresh Token Generation ---------------------
        const newAccessToken = tokenUtils.createAccessToken({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isDeleted: user.isDeleted,
            needPasswordChange: user.needPasswordChange,

        });
        const newRefreshToken = tokenUtils.createRefreshToken({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isDeleted: user.isDeleted,
            needPasswordChange: user.needPasswordChange,
        });


        const betterAuthTokenUpdate = await prisma.session.update({
            where: {
                token: betterAuthSessionToken
            },
            data: {
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set expiration to 1 days from now
            },

        })

        console.log("Better Auth Token Update Result:", betterAuthTokenUpdate);

        console.log("New Access Token:", newAccessToken);
        console.log("New Refresh Token:", newRefreshToken);



        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            betterAuthTokenUpdate
        }



    } catch (error) {
        console.error("Error verifying refresh token:", error);
        throw new AppError(
            status.UNAUTHORIZED,
            "Invalid refresh token.",
            "Token verification Error",
            "Custom path: src/modules/auth/auth.service.ts ,fn: newTokonFromRefreshToken");
    }

}

const updatePassword = async (betterAuthSessionToken: string, payload: any) => {

    console.log("Better Auth Session Token in service:", betterAuthSessionToken);
    console.log("Payload in service:", payload);

    try {
        const result = await auth.api.changePassword({
            body: {
                newPassword: payload.newPassword, // required, The new password to set
                currentPassword: payload.currentPassword, // required, The current user password
                revokeOtherSessions: payload.revokeOtherSessions, // When set to true, all other active sessions for this user will be invalidated
            },
            // This endpoint requires session cookies.
            headers: new Headers(
                {
                    Authorization: `Bearer ${betterAuthSessionToken}`
                }
            ),
        });

        return result;
    } catch (error) {
        console.error("Error updating password:", error);
        throw new AppError(
            status.INTERNAL_SERVER_ERROR,
            ` ${error instanceof Error ? error.message : "Failed to update password."}`,
            "Password Update Error",
            "Custom path: src/modules/auth/auth.service.ts ,fn: updatePassword");
    }
}

const signOut = async (token: string) => {
    const result = await auth.api.signOut({
        headers: new Headers(
            {
                Authorization: `Bearer ${token}`
            }
        ),
    });
    return result;
}


export const authService = {
    signUp,
    signIn,
    newTokonFromRefreshToken,
    signOut,
    updatePassword
};