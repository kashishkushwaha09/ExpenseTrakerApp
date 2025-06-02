const userService = require('../services/userService');
const { AppError } = require('../utils/appError');


const signUpUser=async(req,res)=>{  
    const {name,email,password}=req.body;
    try {
      
        const newUser=await userService.signUpUser(name,email,password);
        if(!newUser){
            throw new AppError("Error creating user", 500);
        }
        return res.status(201).json({
            message:"user created successfully"
        })
    } catch (error) {
        console.log(error);
             if(error instanceof AppError){
               throw error;
             }
             throw new AppError(error.message, 500);
    }
}
const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const existingUser=await userService.findByEmail(email);
                if(!existingUser){
                    return res.status(404).json({message:"User not Found",success:false})
                }
        const token=await userService.loginUser(password,existingUser);
        if(!token){
            throw new AppError("Invalid Credentials", 401);
        }
        return res.status(200).json({message:"Login Successful",token,success:true,user:existingUser})
    } catch (error) {
       console.log(error);
             if(error instanceof AppError){
               throw error;
             }
             throw new AppError(error.message, 500);
    }
}

module.exports={
    signUpUser,
    loginUser,
   
}