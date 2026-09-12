import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { bearer } from "better-auth/plugins";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),
    // session: {
    //     expiresIn: 60 * 60 * 24 * 7, // 7 days
    //     updateAge: 60 * 60 * 24 // 1 day (every 1 day the session expiration is updated)
    // },
    plugins: [
        bearer()
    ]
    ,
    emailAndPassword: {
        enabled: true,
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








});