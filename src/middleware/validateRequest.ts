import { NextFunction, Request, Response } from "express";
import z from "zod";

export const zodValidationFN = (schema: z.ZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req.body);
        if (!result.success) {
            next(result.error);   // ZodError instance
        }
        req.body = result.data; // Assign the validated data back to req.body
        next();

    };
};