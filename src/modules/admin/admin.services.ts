import status from "http-status";
import { UserCreateInput } from "../../generated/prisma/models";
import { auth } from "../../lib/auth";
import { AppError } from "../../shared/apErrorClass"
import { prisma } from "../../lib/prisma";



const createAdmin = async (payload: UserCreateInput & { password: string }) => {

    try {

        if (!payload) {
            throw new AppError(
                400,
                "Bad Request: Payload is required",
                "create_Admin",
                "Custom path: src/modules/admin/admin.service.ts ,fn: createAdmin")
        }

        const result = await auth.api.signUpEmail({
            body: {
                name: payload.name,
                email: payload.email,
                password: payload.password,
                role: payload.role,
            }
        });
        return result;

    } catch (error) {
        console.error("Error creating admin:", error);
        throw new AppError(
            status.INTERNAL_SERVER_ERROR,
            `${error instanceof Error ? error.message : "Unknown error"}`,
            "create_Admin",
            "Custom path: src/modules/admin/admin.service.ts ,fn: createAdmin")
    }
}

const getAllAdmins = async () => {

    const [result, count] = await prisma.$transaction([

        prisma.user.findMany({
            where: {
                role: "ADMIN"
            }
        }),
        prisma.user.count({
            where: {
                role: "ADMIN"
            }
        })
    ])

    return { count, result };

}

const getAdminById = async (Id: string) => {

    const result = await prisma.user.findUnique({
        where: {
            id: Id
        }
    });
    return result;
}

const updateAdmin = async (Id: string, payload: UserCreateInput & { password: string }) => {

    const result = await prisma.user.update({
        where: {
            id: Id
        },
        data: payload
    });
    return result;
}


const deleteAdmin = async (ID: string) => {
    const result = await prisma.user.delete({
        where: {
            id: ID
        }
    });
    return result;
}


export const adminService = {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
}