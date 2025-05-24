const express=require('express');
const router=express.Router();
const authenticateUser=require('../middlewares/auth');
const passwordController=require('../controllers/passwordController')

router.post('/forgotPassword',passwordController.forgotPassword);
router.get('/resetpassword/:uuid',passwordController.checkResetPasswordLink);
router.post('/updatePassword',passwordController.updatePassword);

module.exports=router;