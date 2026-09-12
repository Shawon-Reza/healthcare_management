import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../modules/utils/email";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),
    // session: {
    //     expiresIn: 60 * 60 * 24 * 7, // 7 days
    //     updateAge: 60 * 60 * 24 // 1 day (every 1 day the session expiration is updated)
    // },
    plugins: [
        bearer(),
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, otp, type }) {
                console.log(`Sending OTP to ${email}: ${otp} for ${type}`);
                if (type === "sign-in") {
                    // Send the OTP for sign in
                } else if (type === "email-verification") {
                    // Send the OTP for email verification
                    try {
                        const user = await prisma.user.findUnique({
                            where: { email },
                        });

                        if (user && !user.emailVerified) {
                            sendEmail(
                                {
                                    to: email,
                                    subject: "Email Verification OTP",
                                    template: "email_verification",
                                    templateName: "/otp",
                                    templateData: {
                                        otp,
                                        userName: user.name,
                                    }
                                }
                            );
                        }
                    } catch (error) {
                        console.error("Error sending email verification OTP:", error);
                    }


                } else {
                    // Send the OTP for password reset
                }
            },
        })

    ]
    ,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },

    emailVerification: {
        sendOnSignup: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
    },



    // ----------------------- Additional fields for the user model -----------------------
    user: {
        additionalFields: {
            role: {
                type: "string",
                input: true,
                required: false,
            },

            userStatus: {
                type: "string",
                input: true,
                required: false,
            },

            needPasswordChange: {
                type: "boolean",
                input: false,
                required: false,
            },

            isDeleted: {
                type: "boolean",
                input: false,
                required: false,
            },

            deletedAt: {
                type: "date",
                input: false,
                required: false,
            },
        },
    },


    trustedOrigins: [
        "http://localhost:3000",
    ],





});