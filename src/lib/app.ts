import express from 'express';
import cors from 'cors';
import { prisma } from './prisma';
import { indexRouter } from '../routes/indexRoute';
import { notFoundMiddleware } from '../middleware/not_found';
import { globalErrorHandler } from '../middleware/globalErrorHandler';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth';

export const app = express();

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000"],
    })
);
app.use(cookieParser());
app.all('/api/auth/{*any}', toNodeHandler(auth));
// ---------------- Server Health Check ---------------- 

app.get("/", async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.status(200).json({
            success: true,
            status: "healthy",
            services: {
                api: "up",
                database: "up",
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            status: "unhealthy",
            services: {
                api: "up",
                database: "down",
            },
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString(),
        });
    }
});


//  ---------------- Distribute Routes ----------------
app.use("/api/v1", indexRouter);


// ---------------- Middleware for Error Handling ----------------
app.use(globalErrorHandler);
app.use(notFoundMiddleware);

