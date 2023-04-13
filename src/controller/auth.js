import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { con } from "../config/con_db.js";
import dotenv from 'dotenv'
import crypto from 'crypto'
dotenv.config()

//getting the lecturer infomation and registering them
 export const Registrer =  async (req, res) => {
  const {first_name,last_name,department,email,password,role} = req.body;

  const sql = 'SELECT * FROM lecturer_t WHERE email = ?';
  //check if the user exits if not insert in to table
  con.query(sql, [email], async (err, result) => {
    if (err) throw err;

    if (result[0]) {
      res.status(400).json({ message: "account with email exits" });
    }else{
    const hashpassword = await bcrypt.hash(password, 10);
    
    
    let lecturer_id=crypto.randomUUID()

    let lecturer_role="user"
    if(role){
        lecturer_role=role
    }
    con.query('INSERT INTO `lecturer_t`(`first_name`, `last_name`, `email`, `lecturer_id` ,`password`,`department`,`role`) VALUES (?,?,?,?,?,?,?)',[first_name.toLowerCase(),last_name.toLowerCase(),email.toLowerCase(),lecturer_id,hashpassword,department.toLowerCase(),lecturer_role ], (error,results) =>{
  if(error) throw res.json(error);
  return res.json({"status":"success",message:"Account Created"});
    });
    }
  });
};

export const Login = async(req,res) =>{
    const {email,password} = req.body;
  
     const sql = 'SELECT * FROM lecturer_t WHERE email = ?';
    con.query(sql,[email], async (err,result) =>{
      if(err) throw err;
  
    if (!result[0]) {
      // res.json({message: "Email Not Found"});
      res.status(400).json({status: "failed",message: "Invalid Credentials"});
    }else{
      const passwordH = await bcrypt.compare(password,result[0].password);
     if (!passwordH) {
      res.status(400).json({status: "failed",message: "Invalid Credentials"});
     }else{
      //token for verifying the user
      const sql = 'update lecturer_t set date_last_login=CURRENT_TIMESTAMP where email=? ';
              con.query(sql,[email], async (err,result) =>{
                //   console.log("Update Successful")
              })
  
      const token = jwt.sign({id: result[0].lecturer_id},process.env.JWT_SECRET_KEY,{
        expiresIn: 86400,
      });
      let userdata={
          "first_name": result[0].first_name,
          "last_name":  result[0].last_name,
          "email":  result[0].email,
        //   "lecturer_id": result[0].lecturer_id,
          "date_created":  result[0].date_created,
          "date_last_modified":  result[0].date_last_modified,
          "date_last_login":  result[0].date_last_login
      }
      res.json({status:"success",token , user_data:userdata});
     }
    }
    });
  };

  export const getUser = (req, res) => {
    let token = req.headers.authorization;
   
    if (!token) {
        return res.status(400).status(400).json({ message: "No Token Found!" });
    }
    token=token.split(' ')[1];
    // return res.status(200).json({ message: token });
    
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { id } = data;
    
        
        const sql = 'SELECT * FROM lecturer_t WHERE lecturer_id = ?';
        con.query(sql,[id], async (err,result) =>{
            let userdata={
                "first_name": result[0].first_name,
                "last_name":  result[0].last_name,
                "email":  result[0].email,
                "role":result[0].role,
                "date_created":  result[0].date_created,
                "date_last_modified":  result[0].date_last_modified,
                "date_last_login":  result[0].date_last_login
            }
          return res.status(200).json({ status:200, message:"success",userdata:userdata });
        })
    }
    catch {
        return res.status(400).json({ message: "Invalid Token Found!" });
    }
  }

  export const resetPassword = (req, res) => {
    let token = req.headers.authorization;
   
    if (!token) {
        return res.status(400).json({ message: "No Token Found!" });
    }
    token=token.split(' ')[1];
    const { oldpassword, newpassword} = req.body
    if (!oldpassword){
      return res.status(400).json({ message: "Input Old Password!" });
    }
    if (!newpassword){
      return res.status(400).json({ message: "Input New Password!" });
    }
    // return res.status(200).json({ message: token });
    
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { id } = data;
        
    
        
        const sql = 'SELECT * FROM lecturer_t WHERE lecturer_id = ?';
        con.query(sql,[id], async (err,result) =>{
          const passwordH = await bcrypt.compare(oldpassword,result[0].password);
          if(passwordH){
            const sql = 'update lecturer_t set password=? where lecturer_id=?';
              con.query(sql,[await bcrypt.hash(newpassword, 10),id], async (err,result) =>{
                return res.status(200).json({ message: "Password Changed Successfully!" });
              })
          }
          else{
            //return wrong password
            return res.status(400).json({ message: "Incorrect Password" });
          }
        })
    }
    catch {
        return res.status(400).json({ message: "Invalid Token Found!" });
    }
  }
  
