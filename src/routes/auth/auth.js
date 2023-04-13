import express from "express";
const router = express.Router();
import { Login, Registrer,getUser,resetPassword } from "../../controller/auth.js";
import {userRegister} from "../../middleware/userRegister.js";
import {userLogin} from "../../middleware/userlogin.js";
// import {  Registrer,Login,getUser } from "../../controller/auth.js";
router.use(express.json());

//getting the registrer infomation
router.post("/auth/register",userRegister,Registrer);
router.post("/auth/login",userLogin,Login);
router.get("/auth/getUser",getUser);
router.post("/auth/resetpassword",resetPassword);

export { router as authRouter };