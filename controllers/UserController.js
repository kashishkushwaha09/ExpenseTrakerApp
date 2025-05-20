const bcrypt=require('bcrypt');
const User= require('../models/userModel');

const signUpUser=async(req,res)=>{
    const {name,email,password}=req.body;
    try {
        // Check if the user already exists
        const existingUser=await User.findOne({where:{email:email}});
        if(existingUser){
            return res.status(409).json({
                message:"user already exists"
            })
        }
        const hashPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name:name,
            email:email,
            password:hashPassword
        });
        res.status(201).json({
            message:"user created successfully",
            user:user
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}
const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const existingUser=await User.findOne({
            where:{email}
        });
        if(!existingUser){
            return res.status(404).json({message:"User not Found",success:false})
        }
        console.log(existingUser);
        const isPasswordMatched=await bcrypt.compare(password,existingUser.password);
        if(!isPasswordMatched){
            return res.status(401).json({message:"Password not matched",success:false})
        }
        return res.status(200).json({user:existingUser,success:true})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message,success:false})
    }
}
module.exports={
    signUpUser,
    loginUser
}