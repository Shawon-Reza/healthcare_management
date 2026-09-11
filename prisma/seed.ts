import "dotenv/config";

import { prisma } from "../src/lib/prisma";
import { auth } from "../src/lib/auth";
import { Role } from "../src/generated/prisma/enums";

async function main() {
    
    const email = "superadmin@egmail.com";

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    console.log("Existing user:", existingUser);

    if (existingUser) {
        console.log("Super Admin already exists.");
        return;
    }

    const superAdmin = await auth.api.signUpEmail({
        body: {
            name: "superAdmin",
            email,
            password: "superadmin@egmail.com",
            role: Role.SUPER_ADMIN,
        },
    });

    console.log("Super Admin created:", superAdmin);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });