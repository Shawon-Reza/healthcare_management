import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),
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