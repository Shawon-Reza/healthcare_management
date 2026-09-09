import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../utils/token";

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




export const authService = {
    signUp,
    signIn,
};