import { prisma } from "../src/lib/prisma";


async function main() {
    // seeding logic
    console.log("Seeding schedule data...");


    const schedules: {
        startTime: string;
        endTime: string;
    }[] = [];


    const totalMinutes = 24 * 60;
    const interval = 40;

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

    console.log(schedules);

    const existingSchedules = await prisma.schedule.findFirst({
        where: {
            interval: interval,
        },
    });

    if (existingSchedules) {
        console.log(`Schedules already exist for ${interval} minutes Interval. Skipping seeding.`);
        return;
    }


    for (const schedule of schedules) {
        await prisma.schedule.create({
            data: {
                startTimeString: schedule.startTime,
                endTimeString: schedule.endTime,
                interval: interval,
            },
        });
    }

    console.log("Schedule seeding completed.");

}



main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });