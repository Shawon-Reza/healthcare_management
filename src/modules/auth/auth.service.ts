import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

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

    return result;
}




export const authService = {
    signUp,
    signIn,
};