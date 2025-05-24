const SibApiV3Sdk = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const bcrypt=require('bcrypt');
const User=require('../models/userModel');
const ForgotPasswordRequest=require('../models/forgotPasswordRequests');

const forgotPassword=async(req,res)=>{
    try {
        const {email}=req.body; 
        const uuid=uuidv4(); 
var defaultClient = SibApiV3Sdk.ApiClient.instance;
// # Instantiate the client\
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.MAILING_API_KEY;
var tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
const sender={
    email:'kkachhi178@gmail.com',
    name:"khushboo kachhi"
}
const receivers=[
    {
        email:email,
    }
]
tranEmailApi.sendTransacEmail({
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
}).then(async (response) => {
  console.log("Email sent successfully:", response);
  const existingUser=await User.findOne({where:{email:email}});
  if(!existingUser){
    return res.status(400).json({ message: 'User not exist Do sign up', success: false });
  }
  const forgotPasswordRequest=await ForgotPasswordRequest.create({
    id:uuid,
    UserId:existingUser.id
  })
  return res.status(200).json({ message: 'email sent to your mail id', success: true });
}
)
.catch((err)=>console.log(err))
  
    }

    catch(error){
      console.log(error);
      return res.status(500).json({message:error.message,success:false})
    }
}
const checkResetPasswordLink=async(req,res)=>{
    try {
        console.log("RESET ROUTE HIT:", req.params.uuid);
        const {uuid}=req.params;
        const existedUuid=await ForgotPasswordRequest.findByPk(uuid);
        console.log(existedUuid);
        if(existedUuid && existedUuid.isActive){
        return res.status(200).sendFile(path.join(__dirname,'..','public','resetPassword.html'));
        }else{
           return res.status(400).send('<h1>404-Not Found!!</h1>')  
        }
    } catch (error) {
        console.log(error);
      return res.status(500).send('<h1>Something Went Wrong!!</h1>') 
    }
}
const updatePassword=async(req,res)=>{
 try {
    const {password,uuid}=req.body;
     const existedUuid=await ForgotPasswordRequest.findByPk(uuid);
        console.log(existedUuid);
        if(existedUuid){
 const user=await User.findOne({where:{id:existedUuid.UserId}});
 if(!user){
     return res.status(404).json({ message: 'User not found', success: false });
 }
      const hashPassword=await bcrypt.hash(password,10);
       user.password=hashPassword;
       await user.save();
       existedUuid.isActive=false;
       await existedUuid.save();
       return res.status(200).json({ message: 'Password updated successfully', success: true });

        }else{
             return res.status(400).json({ message: 'Reset Link is incorrect', success: false });
        }
    
 } catch (error) {
     console.log(error);
      return res.status(500).json({message:error.message,success:false})
 }
}
module.exports={
     forgotPassword,
     checkResetPasswordLink,
     updatePassword
}