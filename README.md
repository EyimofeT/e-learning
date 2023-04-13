# Learning Platform
API backend service for a Online Learning Platform For Lecturer.


## Google Drive link to E-R Diagram and Database Schema


## installation
install required packages:
  ->  npm install --save bcryptjs body-parser cookieparser cors dotenv express jsonwebtoken 
  ->  npm install --save-dev nodemon

to run server
    -> npm run start

## EndPoints- Visit Documentation For More Information

 
   

## API Documentation

https://documenter.getpostman.com/view/15065406/2s93Xwyiqs

## Postman Collection Link



## Api Endpoint link on Heroku


## Setting Database Configurations and JWT Secret Key
-> Create a .env file
    
    1. Localhost Running- Include : 
                DB_HOST='127.0.0.1'
                DB_USER=''
                DB_NAME=''
                DB_PASSWORD=''
                DB_PORT=8889
                B_CRYPT_SALT_HASH=10
                PORT=
                JWT_SECRET_KEY=""

    2. When Deploying to a hosting service :  
      Include:    
                DB_HOST='127.0.0.1'
                DB_USER=''
                DB_NAME=''
                DB_PASSWORD=''
                DB_PORT=8889
                B_CRYPT_SALT_HASH=10
                PORT=
                JWT_SECRET_KEY=""   
      Into Hosting Service Environment or Config Variables   



