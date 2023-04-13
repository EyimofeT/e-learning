import express from "express";
const router = express.Router();
import { getStudentXCoursesData } from "../../controller/students.js";


router.use(express.json());

router.get("/students",getStudentXCoursesData)


export { router as StudentRouter };