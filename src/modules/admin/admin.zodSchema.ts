import z from "zod";

// model User {
//   id            String  @id

//   name          String
//   email         String
//   emailVerified Boolean @default(false)
//   image         String?

//   role               Role       @default(PATIENT)
//   userStatus         UserStatus @default(ACTIVE)
//   needPasswordChange Boolean    @default(false)
//   isDeleted          Boolean    @default(false)

//   deletedAt DateTime?
//   createdAt DateTime  @default(now())
//   updatedAt DateTime  @updatedAt

//   sessions  Session[]
//   accounts  Account[]

//   userProfile PatientProfile ?
//   doctorProfile DoctorProfile ?

//   @@unique([email])
//   @@map("user")
// }
export const createAdminPayload = z.object({

    name: z.string().min(2).max(100),
    email: z.email(),
    password: z.string().min(6).max(100),
    role: z.enum(["ADMIN", "USER"]),
    image: z.string().optional(),
    emailVerified: z.boolean().optional(),
    userStatus: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    needPasswordChange: z.boolean().optional(),

    isDeleted: z.boolean().optional()

})

