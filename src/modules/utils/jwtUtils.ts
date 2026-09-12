import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  { expiresIn }: SignOptions
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

const decodeToken = (token: string) => {
  return jwt.decode(token);
};



export const jwtUtils = {
  verifyToken,
  decodeToken,
  createToken,
};