import { catchAsyncError } from "../../shared/catchAsync";
import { Request, Response } from "express";
import { scheduleServices } from "./schedule.services";


const createSchedules = catchAsyncError(
    async (req: Request, res: Response) => {
        const interval = Number(req.params.interval);

        const result = await scheduleServices.createSchedules(interval);
        res.status(201).json({
            success: true,
            message: "Schedules created successfully.",
            data: result,
        });

    }
);


const getAllSchedulesByInterval = catchAsyncError(
    async (req: Request, res: Response) => {
        const interval = Number(req.params.interval);

        const result = await scheduleServices.getAllSchedulesByInterval(interval);
        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No schedules found for ${interval} minutes Interval.`,
                data: null,
            });
        }
        res.status(201).json({
            success: true,
            message: `Schedules fetched successfully for ${interval} minutes Interval.`,
            data: result,
        });

    }
);

const deleteSchedulesByInterval = catchAsyncError(
    async (req: Request, res: Response) => {
        const interval = Number(req.params.interval);

        const result = await scheduleServices.deleteSchedulesByInterval(interval);
        res.status(201).json({
            success: true,
            message: `Schedules deleted successfully for ${interval} minutes Interval.`,
            data: result,
        });

    }
);




export const scheduleControllers = {
    createSchedules,
    getAllSchedulesByInterval,
    deleteSchedulesByInterval
};