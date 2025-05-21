const { Cashfree, CFEnvironment } =require("cashfree-pg"); 
const Order = require("../models/orderModel");

const cashfree = new Cashfree(CFEnvironment.SANDBOX,process.env.CASHFREE_APP_ID, process.env.CASHFREE_SECRET_KEY);

exports.createOrder=async(req,res)=>{
    try {
       const { orderId,
    orderAmount,
    orderCurrency='INR',
    }=req.body;
       const newOrder=await Order.create({
        orderId:orderId,
        email:req.user.email,
        status:'pending'
       })
        const expiryDate=new Date(Date.now()+60*60*1000);
        const formattedExpiryDate=expiryDate.toISOString();
      const request={
        "order_amount": orderAmount,
    "order_currency":orderCurrency,
    "order_id": orderId,
    "customer_details": {
        "customer_id": String(req.user.id),
        "customer_email": req.user.email,
        "customer_phone": "7477050952"
    },
    "order_meta": {
        // "return_url": "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}"
        "return_url":`http://localhost:4000/payment/payment-status/${orderId}`,
        "payment_methods":"ccc,upi,nb"
    },
    "order_expiry_time":formattedExpiryDate,
      }

      const response=await cashfree.PGCreateOrder(request);
      console.log("response from cashfree ",response);
      return res.status(200).json({paymentSession_id:response?.data.payment_session_id,success:true}); 

    } catch (error) {
        console.log("Error creating order:", error);
        return res.status(500).json({ message: error.message });
    }
}

exports.getPaymentStatus=async(req,res)=>{
    try {
        const orderId=req.params.orderId;
        const order=await Order.findOne({where:{orderId:orderId}});
        if(!order){
            return res.status(404).json({message:'Order not found'});
        }
       
        const response=await cashfree.PGOrderFetchPayments(orderId);
        
        let getOrderResponse=response.data;
        let orderStatus;
        if(
            getOrderResponse.filter((transaction)=>transaction.payment_status==='SUCCESS')
            .length>0
        ){
            orderStatus='success';
        }else if(
            getOrderResponse.filter((transaction)=>transaction.payment_status==='PENDING')
            .length>0
        ){
            orderStatus='pending';
        }else{
            orderStatus='failed';
        }
       const updateOrder=await Order.update({
        status:orderStatus},
        {
            where:{
                orderId:orderId
            },
        },
    );
       return res.status(200).json({orderStatus,success:true});
    } catch (error) {
        console.log("Error getting payment status:", error.message);
        return res.status(500).json({ message: 'Error getting payment status' });
    }
}
// import { Cashfree, CFEnvironment } from "cashfree-pg"; 

// const cashfree = new Cashfree(CFEnvironment.SANDBOX, "{appId}", "TESTaf195616268bd6202eeb3bf8dc458956e7192a85");

// cashfree.PGOrderFetchPayments("your-order-id").then((response) => {
//     console.log('Order fetched successfully:', response.data);
// }).catch((error) => {
//     console.error('Error:', error.response.data.message);
// });