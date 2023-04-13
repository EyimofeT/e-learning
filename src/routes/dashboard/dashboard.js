import express from "express";
const router = express.Router();
import { getDashboardData } from "../../controller/dashboard.js";


router.use(express.json());

router.get("/dashboard",getDashboardData)


export { router as DashboardRouter };