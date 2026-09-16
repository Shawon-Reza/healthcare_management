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

    const existance = await prisma.user.findUnique({
        where: { email: payload.email }
    });

    if (existance) {
        throw new AppError(
            status.CONFLICT,
            "User with this email already exists.",
            "User Already Exists",
            "Custom path: src/modules/auth/auth.service.ts ,fn: signUp"
        );
    }

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

    const sendSignInOTP = await auth.api.sendVerificationOTP({
        body: {
            email: result.user.email, // required, Email address to send the OTP.
            type: "sign-in", // required, Type of the OTP. `sign-in`, `email-verification`, or `forget-password`.
        },
    });
    return {
        accessToken,
        refreshToken,
        ...result,
        patient,
        sendSignInOTP
    };
}


const signIn = async (email: string, password: string) => {
    console.log("From signIn service:----------------------------")
    const result = await auth.api.signInEmail({
        body: {
            email, password
        },
    });

    console.log("From signIn service: ---------------------", result)
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

const resetPassword = async (email: string) => {
    console.log("Email in resetPassword service:", email);

    console.log("from resetPassword service:----------------------------");

    const result = await auth.api.requestPasswordResetEmailOTP({
        body: {
            email: email, // required, Email address to send the OTP.
        },
    });



    return result;
}

const reset_password_with_otp = async (email: string, otp: string, newPassword: string) => {
    const result = await auth.api.resetPasswordEmailOTP({
        body: {
            email: email, // required, Email address to reset the password.
            otp: otp, // required, OTP sent to the email.
            password: newPassword, // required, New password.
        },

    });
    console.log("Reset password with OTP result:", result);
    return result;
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

const googleSignInSuccess = async (session: Record<string, any>) => {
    // console.log("Session from Google Sign-In:", session);

    const isPatientExists = await prisma.patientProfile.findUnique({
        where: {
            userId: session.user.id,
        },
        include: {
            user: true, // Include the related user data
        },
    })

    console.log("isPatientExists: From services", isPatientExists);

    if (isPatientExists) {
        const accessToken = tokenUtils.createAccessToken({
            userId: isPatientExists.user.id,
            email: isPatientExists.user.email,
            name: isPatientExists.user.name,
            role: isPatientExists.user.role,
            isDeleted: isPatientExists.user.isDeleted,
            needPasswordChange: isPatientExists.user.needPasswordChange,

        });
        const refreshToken = tokenUtils.createRefreshToken({
            userId: isPatientExists.user.id,
            email: isPatientExists.user.email,
            name: isPatientExists.user.name,
            role: isPatientExists.user.role,
            isDeleted: isPatientExists.user.isDeleted,
            needPasswordChange: isPatientExists.user.needPasswordChange,
        });
        return {
            accessToken,
            refreshToken,
            isPatientExists
        }
    }


    const patientProfile = await prisma.patientProfile.create({
        data: {
            userId: session.user.id,
            name: session.user.name,
            email: session.user.email,
        },
        include: {
            user: true
        }

    });

    const accessToken = tokenUtils.createAccessToken({
        userId: patientProfile.user.id,
        email: patientProfile.user.email,
        name: patientProfile.user.name,
        role: patientProfile.user.role,
        isDeleted: patientProfile.user.isDeleted,
        needPasswordChange: patientProfile.user.needPasswordChange,

    });
    const refreshToken = tokenUtils.createRefreshToken({
        userId: patientProfile.user.id,
        email: patientProfile.user.email,
        name: patientProfile.user.name,
        role: patientProfile.user.role,
        isDeleted: patientProfile.user.isDeleted,
        needPasswordChange: patientProfile.user.needPasswordChange,
    });


    return {
        accessToken,
        refreshToken,
        patientProfile
    }
}


export const authService = {
    signUp,
    signIn,
    newTokonFromRefreshToken,
    signOut,
    updatePassword,
    resetPassword,
    reset_password_with_otp,
    googleSignInSuccess

};