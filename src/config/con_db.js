import mysql_con from "mysql";
import dotenv from 'dotenv'
dotenv.config()

export const con = mysql_con.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:process.env.DB_PORT,
  multipleStatements: true,
});

con.connect((err)=>{
  if(!err)
  console.log("Connected To Database")
  else
  console.log("Error" + JSON.stringify(err,undefined, 2))
  
})



