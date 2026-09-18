import { NextFunction, Request, Response } from "express";



// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notFoundMiddleware = (req:Request, res:Response, next:NextFunction) => {

    res.status(404).json({
        success: false,
        status: 404,
        message: `The requested URL ${req.originalUrl} was not found on this server.`,
    })
}