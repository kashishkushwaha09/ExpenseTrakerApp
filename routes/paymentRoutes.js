const express=require('express');
const router=express.Router();
const authUser=require('../middlewares/auth');
const paymentController=require('../controllers/paymentController');
router.post('/create-order',authUser,paymentController.createOrder);
router.get('/payment-status/:orderId',paymentController.getPaymentStatus);


module.exports=router;