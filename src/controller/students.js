import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { con } from "../config/con_db.js";
import dotenv from 'dotenv'
import crypto from 'crypto'
dotenv.config()

export const getStudentXCoursesData = (req, res) => {
    let token = req.headers.authorization;
   
    if (!token) {
        return res.status(400).json({ message: "No Token Found!" });
    }
    token=token.split(' ')[1];
    let no_of_students,no_of_courses,studentXcourses;
    try {
        
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { id } = data;
      
        const sql ='select enrolled_course_t.*,course_t.* from enrolled_course_t join course_t on enrolled_course_t.course_id=course_t.course_id where enrolled_course_t.course_id in (select course_t.course_id from course_t where course_t.lecturer_id=?)'
        con.query(sql,[id],async (err,result) =>{ 
            let counter=0
            while(counter<result.length){
                result[counter].time=JSON.parse(result[counter].time)
                
                counter++                
            }
            let data={
                        "studentXcourses":result
                    }
            return res.status(200).json({ status:200, message:"success", data:result});

        })

    }
    catch {
        return res.status(400).json({ message: "Invalid Token Found!" });
    }
  }
