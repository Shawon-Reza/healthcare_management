export {};

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                name: string;
                role: string;
                isDeleted: boolean;
                needPasswordChange: boolean;
                iat: number;
                exp: number;
            };
        }
    }
}