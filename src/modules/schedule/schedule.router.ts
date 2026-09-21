import { Router } from "express";
import { scheduleControllers } from "./schedule.controllers";

export const schedulesRouter = Router()

schedulesRouter.post("/:interval", scheduleControllers.createSchedules)
schedulesRouter.get("/:interval", scheduleControllers.getAllSchedulesByInterval)
schedulesRouter.delete("/:interval", scheduleControllers.deleteSchedulesByInterval)