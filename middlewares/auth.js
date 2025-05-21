const jwt=require('jsonwebtoken');
const SECRET_KEY='afab7a6b4b778789b93333dfb8e25f7f6299ee7602e414a47f420b12d1470d09';
const User=require('../models/userModel');
const authenticateUser=async (req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({message:"User Unauthorized"});

   
    try {
         const token=authHeader.split(' ')[1];
        const decode=jwt.verify(token,SECRET_KEY);
     const user=await User.findByPk(decode.userId);
     req.user=user;
    
     next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({message:'Invalid Token'});
    }
}

module.exports=authenticateUser;