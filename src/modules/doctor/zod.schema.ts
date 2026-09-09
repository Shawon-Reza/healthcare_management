import z from "zod";

export const createDoctorProfilePayloadSchema = z.object({

    name: z.string().min(1, "Name is required.").max(100, "Name cannot exceed 100 characters."),
    email: z.email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),


    profilePicture: z
        .url("Invalid profile picture URL")
        .optional(),

    contactNumber: z
        .string()
        .min(10, "Contact number must be at least 10 characters")
        .max(15, "Contact number cannot exceed 15 characters")
        .optional(),

    address: z
        .string()
        .max(255, "Address cannot exceed 255 characters")
        .optional(),

    registerNumber: z
        .string()
        .max(50, "Register number cannot exceed 50 characters")
        .optional(),

    age: z
        .number()
        .int("Age must be an integer")
        .min(18, "Doctor must be at least 18 years old")
        .max(100, "Invalid age")
        .optional(),

    appointmentFee: z
        .number()
        .nonnegative("Appointment fee cannot be negative")
        .optional(),

    qualification: z
        .string()
        .max(255, "Qualification cannot exceed 255 characters")
        .optional(),

    workingHospital: z
        .string()
        .max(255, "Working hospital cannot exceed 255 characters")
        .optional(),

    designation: z
        .string()
        .max(100, "Designation cannot exceed 100 characters")
        .optional(),

    specializations: z
        .array(z.string().min(1, "Specialization cannot be empty"))
        .nonempty("At least one specialization is required."),
});