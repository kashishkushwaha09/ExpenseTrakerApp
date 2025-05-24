const SibApiV3Sdk = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');

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
  const forgotPasswordRequest=await ForgotPasswordRequest.create({
    id:uuid,
    UserId:req.user.id
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
        const {uuid}=req.params;
        const existedUuid=await ForgotPasswordRequest.findByPk(uuid);
        if(existedUuid && existedUuid.isActive){
        return res.status(200).json({ message: 'reset your password', success: true });
        }else{
           return res.status(400).json({message:"Invalid reset password link",success:false})  
        }
    } catch (error) {
        console.log(error);
      return res.status(500).json({message:error.message,success:false}) 
    }
}
const updatePassword=async(req,res)=>{
 try {
    const {password}=req.body;
 } catch (error) {
    
 }
}
module.exports={
     forgotPassword,
     checkResetPasswordLink,
     updatePassword
}