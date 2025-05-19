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
        const user=await User.create({
            name:name,
            email:email,
            password:password
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

module.exports={
    signUpUser
}