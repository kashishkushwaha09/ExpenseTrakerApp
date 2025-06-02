const SibApiV3Sdk = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const bcrypt=require('bcrypt');
const db=require('../models');
const User=db.Users;
const ForgotPasswordRequest=db.ForgotPasswordRequests;
const {AppError}= require('../utils/appError');

const forgotPassword=async(email)=>{
    try {
        const uuid=uuidv4(); 
         const existingUser=await User.findOne({where:{email:email}});
  if(!existingUser){
    throw new AppError('User not exist Do sign up', 400);
  }
var defaultClient = SibApiV3Sdk.ApiClient.instance;
// # Instantiate the client\
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.MAILING_API_KEY;
var tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
const sender={
    email:process.env.MY_EMAIL,
    name:"khushboo kachhi"
}
const receivers=[
    {
        email:email,
    }
]
const response=await tranEmailApi.sendTransacEmail({
    sender,
    to:receivers,
    subject:'ExpenseTracker Reset Password',
    htmlContent:`
    <h1>Reset password with the below link</h1>
    ,<a href='http://localhost:4000/password/resetpassword/{{params.uuid}}'>
     Click here to reset your password </a>
    `,
    params:{
        uuid:uuid
    }
})
  console.log("Email sent successfully:", response);
 
  const forgotPasswordRequest=await ForgotPasswordRequest.create({
    id:uuid,
    UserId:existingUser.id
  })
  console.log("Forgot Password Request created:", forgotPasswordRequest);
  return forgotPasswordRequest;
} catch(error){
      console.log(error);
      if(error instanceof AppError){
        throw error;
      }
      throw new AppError(error.message, 500);
    }
}
const checkResetPasswordLink=async(uuid)=>{
    try {
        const existedUuid=await ForgotPasswordRequest.findByPk(uuid);
        return existedUuid;
    } catch (error) {
        console.log(error);
      if(error instanceof AppError){
        throw error;
      }
      throw new AppError(error.message, 500);
    }
}
const updatePassword=async(password,uuid)=>{
 try {
    const existedUuid=await ForgotPasswordRequest.findByPk(uuid);
      if(!existedUuid){
        throw new AppError('Reset Link is incorrect', 400);

      }
      if(existedUuid?.isActive===false){
        throw new AppError('Reset Link is expired', 400);
      }
    
 const user=await User.findOne({where:{id:existedUuid.UserId}});
 if(!user){
     throw new AppError('User not found', 404);
 }
      const hashPassword=await bcrypt.hash(password,10);
       user.password=hashPassword;
       await user.save();
       existedUuid.isActive=false;
       await existedUuid.save();
       return existedUuid;

        
 } catch (error) {
      console.log(error);
      if(error instanceof AppError){
        throw error;
      }
      throw new AppError(error.message, 500);
 }
}
module.exports={
     forgotPassword,
     checkResetPasswordLink,
     updatePassword
}