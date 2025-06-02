const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const db = require('../models');
const { AppError } = require('../utils/appError');
const User = db.Users;

const findByEmail=async(email)=>{
    try {
        const user=await User.findOne({where:{email:email}});
        return user;
    } catch (error) {
        throw new AppError(error.message,500);
    }
}
const signUpUser=async(name,email,password)=>{  
    
    try {
          // Check if the user already exists
                const existingUser=await findByEmail(email);
                if(existingUser){
                    throw new AppError("User already exists", 409);
                }
        const hashPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name:name,
            email:email,
            password:hashPassword
        });
        return user;
    } catch (error) {
       throw new AppError(error.message,500);
    }
}
const loginUser=async(password,existingUser)=>{
    try {
         
        const isPasswordMatched=await bcrypt.compare(password,existingUser.password);
        if(!isPasswordMatched){
            return null;
        }
        const token=jwt.sign(
            {userId:existingUser.id,email:existingUser.email},
            process.env.SECRET_KEY,
            {expiresIn:'7d'}
        );
        return token;
    } catch (error) {
        console.log(error);
        throw new AppError(error.message, 500);
    }
}
const getUserById=async(id,transactions)=>{
    try {
        const user=await User.findByPk(id,transactions);
        return user;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

module.exports={
    findByEmail,
    signUpUser,
    loginUser,
    getUserById
}