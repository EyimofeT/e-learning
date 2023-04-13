import express from "express";
const router = express.Router();

// import { getCourse, getCourseById,register,getRegisteredCourse } from "../../controller/courses.js";
import {CreateCourse, getAllCourses,getCourseById,updateCourseById} from "../../controller/courses.js";
import {createcourse_middleware} from "../../middleware/createcourse.js";
router.use(express.json());

//getting the registrer infomation
// router.get("/courses",getCourse);
// router.get("/courses/view",getCourseById);
// router.post("/courses/register",register);
// router.get("/courses/registered",getRegisteredCourse)

router.post("/courses/create",createcourse_middleware,CreateCourse)
router.get("/courses/view",getAllCourses);
router.get("/courses/view/:id",getCourseById);
router.patch("/courses/update/:id",updateCourseById);

export { router as courseRouter };