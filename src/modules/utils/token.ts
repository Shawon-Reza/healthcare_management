import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwtUtils";
import { cookiesUtils } from "./cookies";
import { Response } from "express";


const createAccessToken = (payload: JwtPayload) => {
    const token = jwtUtils.createToken(
        payload,
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
        }
    );

    return token;
};


const createRefreshToken = (payload: JwtPayload) => {
    const token = jwtUtils.createToken(
        payload,
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]
        }
    );

    return token;
};



// ----------------------- set cookie -----------------------
const setAccessTokenCookie = (res: Response, key: string, value: string) => {
    cookiesUtils.setCookie(res, key, value,
        {
            httpOnly: true,  // JS can't read
            secure: false,  // true in HTTPS production
            sameSite: "none", // cross-site rule
            maxAge: 60 * 60 * 24 * 1000, // 1day
            path: "/",       // all routes
        }
    );
}

const setRefreshTokenCookie = (res: Response, key: string, value: string) => {
    cookiesUtils.setCookie(res, key, value,
        {
            httpOnly: true,  // JS can't read
            secure: false,  // true in HTTPS production
            sameSite: "none", // cross-site rule
            maxAge: 60 * 60 * 24 * 1000 * 7, // 7day
            path: "/",       // all routes
        }
    );
}

const setBetterAuthTokenCookie = (res: Response, key: string, value: string) => {
    cookiesUtils.setCookie(res, key, value,
        {
            httpOnly: true,  // JS can't read
            secure: false,  // true in HTTPS production
            sameSite: "none", // cross-site rule
            maxAge: 60 * 60 * 24 * 1000, // 7day
            path: "/",       // all routes
        }
    );
}


export const tokenUtils = {
    createAccessToken,
    createRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthTokenCookie
};