import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import cors from "cors";
import morgan from 'morgan';
import cookie from "cookie-parser";
import {StudentRouter} from "./routes/students/students.js";
import {authRouter} from "./routes/auth/auth.js"
import {DashboardRouter} from "./routes/dashboard/dashboard.js";
import { courseRouter } from './routes/courses/courses.js';

const app = express();

//For getting data from the frontend as json format 
app.use(express.json());

//trying to make api request from front end
app.use(cors());


// Logging middleware
app.use(morgan('combined'));

//all users routers
app.use("/api/v1",authRouter)
app.use("/api/v1",courseRouter)
app.use("/api/v1", StudentRouter);

app.use("/api/v1", DashboardRouter);

app.use(cookie());

app.listen(process.env.PORT,()=> console.log("SERVER STARTED"));

//to start the app run {npm start}