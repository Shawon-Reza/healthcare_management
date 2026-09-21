import { prisma } from "../../lib/prisma";
import { AppError } from "../../shared/apErrorClass";




const createSchedules = async (interval: number) => {

    try {
        const existingSchedules = await prisma.schedule.findFirst({
            where: {
                interval: interval,
            },
        });

        if (existingSchedules) {
            console.log(`Schedules already exist for ${interval} minutes Interval. Skipping Creating...`);
            throw new AppError(
                500,
                `Schedules already exist for ${interval} minutes Interval. Skipping Creating.`,
                "CreateSchedulesError",
                "Custom path: src/modules/schedule/schedule.services.ts ,fn: createSchedules "
            );
        }

        //  If schedules already exist for the given interval, we can skip the seeding process. Otherwise, we will create new schedules based on the specified interval.
        const schedules: {
            startTime: string;
            endTime: string;
        }[] = [];


        const totalMinutes = 24 * 60;

        function formatTime(totalMinutes: number) {
            const hour24 = Math.floor(totalMinutes / 60);
            const minute = totalMinutes % 60;

            const period = hour24 >= 12 ? "PM" : "AM";
            const hour12 = hour24 % 12 || 12;

            return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
        }

        for (let minutes = 0; minutes < totalMinutes; minutes += interval) {
            const startTime = formatTime(minutes);
            const endTime = formatTime(minutes + interval);

            schedules.push({
                startTime,
                endTime,
            });
        }

        console.log("All schedules created successfully for the given interval:", schedules);

        const createdSchedules = await prisma.schedule.createMany({
            data: schedules.map((schedule) => ({
                startTimeString: schedule.startTime,
                endTimeString: schedule.endTime,
                interval: interval,
            })),
        });

        console.log("Created schedules:", createdSchedules);

        return {
            createdSchedules,
        };
    } catch (error) {
        console.error(`Error while creating schedules for ${interval} minutes Interval:`, error);
        throw error
    }

}

const getAllSchedulesByInterval = async (interval: number) => {
    try {
        const result = await prisma.schedule.findMany({
            where: {
                interval: interval,
            },
        });

        return result;

    } catch (error) {
        console.error(`Error while fetching schedules for ${interval} minutes Interval:`, error);
        throw new AppError(
            500,
            `Error while fetching schedules for ${interval} minutes Interval.`,
            "GetSchedulesError",
            "Custom path: src/modules/schedule/schedule.services.ts ,fn: getAllSchedulesByInterval "
        );
    }
}

const deleteSchedulesByInterval = async (interval: number) => {
    try {

        const existingSchedules = await prisma.schedule.findFirst({
            where: {
                interval: interval,
            },
        });
        if (!existingSchedules) {
            console.log(`No schedules found for ${interval} minutes Interval. Skipping Deletion...`);
            throw new AppError(
                500,
                `No schedules found for ${interval} minutes Interval. Skipping Deletion.`,
                "DeleteSchedulesError",
                "Custom path: src/modules/schedule/schedule.services.ts ,fn: deleteSchedulesByInterval "
            );
        }

        const result = await prisma.schedule.deleteMany({
            where: {
                interval: interval,
            },
        });

        return result;

    } catch (error) {
        console.error(`Error while fetching schedules for ${interval} minutes Interval:`, error);
        throw error 
    }
}


export const scheduleServices = {
    createSchedules,
    getAllSchedulesByInterval,
    deleteSchedulesByInterval
};