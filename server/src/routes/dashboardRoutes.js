import { Router } from "express";
import {
    getSummary,
    getCategoryBreakdown,
    getMonthlyTrend,
    getFullMonthlyTrend
} from "../controllers/dashboardController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/summary", getSummary);
router.get("/category-breakdown", getCategoryBreakdown);
router.get("/monthly-trend", getMonthlyTrend);
router.get("/monthly-trend/full", getFullMonthlyTrend);

export default router;
