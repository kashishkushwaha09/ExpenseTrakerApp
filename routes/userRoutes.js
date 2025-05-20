const express=require('express');
const router=express.Router();
const userController=require('../controllers/UserController');
router.post('/',userController.signUpUser);
router.post('/login',userController.loginUser);


module.exports=router;