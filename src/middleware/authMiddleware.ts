import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { jwtUtils } from "../modules/utils/jwtUtils";
import { env } from "../config/env";



export const authMiddleware = (allowRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

        console.log("token", accessToken)
        console.log("roles", allowRoles)

        if (!accessToken) {
            return res.status(401).json(
                {
                    status: status.UNAUTHORIZED,
                    success: false,
                    message: "Unauthorized: No access token provided"
                }
            );
        }
        const tokenVarify = jwtUtils.verifyToken(accessToken, env.ACCESS_TOKEN_SECRET);
        console.log("tokenVarify", tokenVarify)
        if (!tokenVarify) {
            return res.status(401).json(
                {
                    status: status.UNAUTHORIZED,
                    success: false,
                    message: "Unauthorized: Invalid access token"
                }
            );
        }
        if (
            allowRoles.length > 0 &&
            (typeof tokenVarify === "string" || !allowRoles.includes(tokenVarify.role))
        ) {
            return res.status(403).json(
                {
                    status: status.FORBIDDEN,
                    success: false,
                    message: "Forbidden: Insufficient permissions"
                }
            );
        }

        req.user = tokenVarify as NonNullable<Request["user"]>;
        next();


    }
}