import { Router } from "express";
import { checkJwt } from "../auth/auth0Middleware";
import {
  generatePlan,
  downloadCalendar,
  updateCalendarById,
  deleteCalendar,
  viewCalendar,
  getLatestCalendar,
} from "../controller/calendarController";

const router = Router();

router.post("/plan", checkJwt, generatePlan as any);
router.get("/download/:id",checkJwt, downloadCalendar as any);
router.get("/view/:id", checkJwt, viewCalendar as any);
router.post("/update/:id", checkJwt, updateCalendarById as any);
router.delete("/delete_calendar/:id", checkJwt, deleteCalendar as any);
router.get("/latest", checkJwt, getLatestCalendar);


export default router;
