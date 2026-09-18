import { NextFunction, Request, RequestHandler, Response } from "express";
// import z from "zod";

export const catchAsyncError = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.error("Error in catchAsyncError:", error);
            // res.status(500).json({
            //     success: false,
            //     message: "An unexpected error occurred.",
            //     error: error instanceof Error ? error.message : String(error),
            //     data: null
            // });
            next(error); // Pass the error to the next middleware (error handler)
        }
    };
};



//  -------------------- For Zod Validation -------------------- //
// export const zodValidationFN = (schema: z.ZodObject) => {
//     return (req: Request, res: Response, next: NextFunction) => {

//         const result = schema.safeParse(req.body);
//         if (!result.success) {
//             next(result.error);   // ZodError instance
//         }
//         req.body = result.data; // Assign the validated data back to req.body
//         next();

//     };
// };