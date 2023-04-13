import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { con } from "../config/con_db.js";
import dotenv from 'dotenv'
import crypto from 'crypto'
dotenv.config()

export const CreateCourse =  async (req, res) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(400).status(400).json({ message: "No Token Found!" });
    }
    const {name,code,description,duration_per_week,location,time,course_media_url,course_group} = req.body;
    
   
   
    token=token.split(' ')[1];
    // return res.status(200).json({ message: token });
    
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { id } = data;
    
        //check first if course code already exists
        const sql = 'SELECT * FROM course_t WHERE course_id = ?';
    
        con.query(sql, [code], async (err, result) => {
        if (err) throw err;

        if (result[0]) {
        res.status(400).json({ message: "course code already exits" });
        }
        else{
            //creates course here
            const create_course_sql='INSERT INTO `course_t`(`name`, `course_id`, `short_code`, `lecturer_id` ,`course_group`,`description`,`duration_per_week`,`location`,`time`,`course_media_url`) VALUES (?,?,?,?,?,?,?,?,?,?)'
            con.query(create_course_sql,[name.toLowerCase(),code.toLowerCase(),code.toLowerCase(),id,course_group,description.toLowerCase(),duration_per_week,location.toLowerCase(),JSON.stringify(time),course_media_url],async(err,result)=>{
                if(err){
                    // console.log(err)
                    console.log(time)
                    return res.status(400).json({ message: "An Error Occured" });
                    
                }
                else{
                    console.log(time)
                    return res.status(200).json({ message: "Course Created Successfully" });
                }
            })
        }
        });
     
    }
    catch {
        return res.status(400).json({ message: "Invalid Token Found!" });
    }

  };

export const getAllCourses = (req, res) => {
    let token = req.headers.authorization;
   
    if (!token) {
        return res.status(400).json({ message: "No Token Found!" });
    }
    token=token.split(' ')[1];
    // return res.status(200).json({ message: token });
    
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { id } = data;

        let total_courses=[]
        const sql = 'SELECT course_t.*,count(enrolled_course_t.course_id) as total_registerd_students FROM course_t left join enrolled_course_t on course_t.course_id=enrolled_course_t.course_id where course_t.lecturer_id=? GROUP BY course_t.id ';
        con.query(sql,[id],async (err,result) =>{
            // console.log(result.length)
            let counter=0
            while(counter<result.length){
                result[counter].time=JSON.parse(result[counter].time)
                
                counter++
                
            }
            return res.status(200).json({ status:200, message:"success",courses:result });
        })
    }
    catch {
        return res.status(400).json({ message: "Invalid Token Found!" });
    }
  }

export const getCourseById=(req, res)=>{
    let token = req.headers.authorization;
   
    if (!token) {
        return res.status(400).json({ message: "No Token Found!" });
    }
    token=token.split(' ')[1];
    // return res.status(200).json({ message: token });
    
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { id } = data;
        const course_id = req.params.id;
        const sql = "SELECT * FROM course_t where course_id=? ";
        con.query(sql, [course_id], async (err, result) => {
          if (err) {
            console.log(err);
            return res.status(400).json({ message: "An Error Occured!" });
          }
          result[0].time = JSON.parse(result[0].time);
          console.log(result);
          const no_of_student_sql ="select count(*) as total from enrolled_course_t where course_id=?";
          con.query(no_of_student_sql, [course_id], async (err, students) => {
            return res
              .status(200)
              .json({
                status: 200,
                message: "success",
                course: result[0],
                no_of_student: students[0].total,
              });
          });
        });
    }
    catch {
        return res.status(400).json({ message: "Invalid Token Found!" });
    }
  }

export const updateCourseById=(req, res)=>{
    let token = req.headers.authorization;
    const {name,description,duration_per_week,location,time,course_media_url,course_group} = req.body;
    if (!token) {
        return res.status(400).json({ message: "No Token Found!" });
    }
    token=token.split(' ')[1];
    
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { id } = data;
        const course_id=req.params.id

        //perform check if the course exists and if the course owner is current accessing lecturer_id
        const sql = 'SELECT * FROM course_t WHERE course_id = ?';
    
        con.query(sql, [course_id], async (err, result) => {
        if (err) throw err;
        if(!result[0]){
        res.status(400).json({status:"failed", message: "course not found" });
        }
        else if (result[0].lecturer_id != id) {
            res.status(400).json({status:"failed", message: "cannot modify course you didn't create" });
            }
            // else{
            //     res.status(200).json({status:"success", message: "good to go" });
            // }
        else{
        //update logic
        let fieldsToUpdate='';
        let valuesToUpdate=[];

        if(name){
            fieldsToUpdate +='name=?, ';
            valuesToUpdate.push(name)
        }
        if(description){
            fieldsToUpdate +='description=?, ';
            valuesToUpdate.push(description)
        }
        if(duration_per_week){
            fieldsToUpdate +='duration_per_week=?, ';
            valuesToUpdate.push(duration_per_week)
        }
        if(location){
            fieldsToUpdate +='location=?, ';
            valuesToUpdate.push(location)
        }
        if(time){
            fieldsToUpdate +='time=?, ';
            valuesToUpdate.push(JSON.stringify(time))
        }
        if(course_media_url){
            fieldsToUpdate +='course_media_url=?, ';
            valuesToUpdate.push(course_media_url)
        }
        if(course_group){
            fieldsToUpdate +='course_group=?, ';
            valuesToUpdate.push(course_group)
        }
        console.log(fieldsToUpdate)
        //Remove the trailing comma and space from the fieldtoupdate
        fieldsToUpdate=fieldsToUpdate.slice(0, -2);
        console.log(fieldsToUpdate)

        if(!fieldsToUpdate){
            res.status(400).json({status:"failed", message: "cannot update empty data set" });
        }
        const sql=`Update course_t set ${fieldsToUpdate} where course_id=?`
        valuesToUpdate.push(course_id);

        con.query(sql,valuesToUpdate,async (err,result) =>{
            if(err){
                console.log(err)
                return res.status(400).json({ message: "An Error Occured" });
            }
            else{
                return res.status(200).json({ message: "Update Successful" });
            }
        })

        }
    })
    
    }
    catch {
        return res.status(400).json({ message: "Invalid Token Found!" });
    }
}