import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { con } from "../config/con_db.js";
import dotenv from 'dotenv'
import crypto from 'crypto'
dotenv.config()

export const getDashboardData = (req, res) => {
    let token = req.headers.authorization;
   
    if (!token) {
        return res.status(400).json({ message: "No Token Found!" });
    }
    token=token.split(' ')[1];
    let no_of_students,no_of_courses,studentXcourses;
    try {
        
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { id } = data;
        //total number of students
        const sql = 'select count(enrolled_course_t.student_id) as no_of_students from enrolled_course_t where enrolled_course_t.course_id in (select course_t.course_id from course_t where course_t.lecturer_id=?)';
        //total number of courses
        const sql2 ='select count(*) as no_of_courses from course_t where lecturer_id=?';
        //students and course details
        const sql3 ='select enrolled_course_t.*,course_t.* from enrolled_course_t join course_t on enrolled_course_t.course_id=course_t.course_id where enrolled_course_t.course_id in (select course_t.course_id from course_t where course_t.lecturer_id=?)'
       

        con.query(sql,[id],async (err,result) =>{  
            no_of_students=await result[0].no_of_students
           
            con.query(sql2,[id], async (err,result) =>{  
                no_of_courses=await result[0].no_of_courses
               
                con.query(sql3,[id],async (err,result) =>{  
                    studentXcourses=await result
                    let counter=0
                    while(counter<result.length){
                        result[counter].time=JSON.parse(result[counter].time)
                        
                        counter++
                        
                    }
                    let data={
                        "no_of_courses":no_of_courses,
                        "no_of_students":no_of_students,
                        "studentXcourses":studentXcourses
                    }
                     return res.status(200).json({ status:200, message:"success", data});
               
                    })
                    });
      
        });

    }
    catch {
        return res.status(400).json({ message: "Invalid Token Found!" });
    }
  }
