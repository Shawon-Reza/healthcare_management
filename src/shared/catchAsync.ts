import { NextFunction, Request, RequestHandler, Response } from "express";

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