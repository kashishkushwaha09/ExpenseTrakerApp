const paymentService = require("../services/paymentService");
const { AppError } = require("../utils/appError");


exports.createOrder=async(req,res)=>{
    try {
       const { orderId,
    orderAmount,
    orderCurrency='INR',
    }=req.body;
       const paymentSession_id=await paymentService.createOrder(
        orderId,
        orderAmount,
        orderCurrency,
        req.user
      );
      return res.status(200).json({paymentSession_id,success:true});

    } catch (error) {
        console.log("Error creating order:", error);
       throw new AppError(error.message, 500);
    }
}

exports.getPaymentStatus=async(req,res)=>{
    try {
        const orderId=req.params.orderId;
       const orderStatus=await paymentService.getPaymentStatus(orderId);
        if(!orderStatus){
            throw new AppError('Order not found', 404);
        }
       return res.status(200).json({status:orderStatus,success:true});
    } catch (error) {
        console.log("Error fetching payment status:", error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message, 500);
    }
}
