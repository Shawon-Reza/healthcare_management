import express from 'express';
import cors from 'cors';
import { prisma } from './prisma';

export const app = express();

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000"],
    })
);

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


