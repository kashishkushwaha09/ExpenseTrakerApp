const { Cashfree, CFEnvironment } =require("cashfree-pg"); 
const db = require("../models");
const { AppError } = require("../utils/appError");
const Order=db.Orders;
const User =db.Users;

const cashfree = new Cashfree(CFEnvironment.SANDBOX,process.env.CASHFREE_APP_ID, process.env.CASHFREE_SECRET_KEY);

exports.createOrder=async(orderId,
    orderAmount,
    orderCurrency='INR',user)=>{
    try {
       const newOrder=await Order.create({
        orderId:orderId,
        email:user.email,
        status:'pending'
       })
        const expiryDate=new Date(Date.now()+60*60*1000);
        const formattedExpiryDate=expiryDate.toISOString();
      const request={
        "order_amount": orderAmount,
    "order_currency":orderCurrency,
    "order_id": orderId,
    "customer_details": {
        "customer_id": String(user.id),
        "customer_email": user.email,
        "customer_phone": "7477050952"
    },
    "order_meta": {
        // "return_url": "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}"
        "return_url":`http://localhost:4000/expense.html?orderId=${orderId}`,
        "payment_methods":"ccc,upi,nb"
    },
    "order_expiry_time":formattedExpiryDate,
      }

      const response=await cashfree.PGCreateOrder(request);
     const paymentSessionId=response?.data?.payment_session_id;
     return paymentSessionId;
    } catch (error) {
        console.log("Error creating order:", error);
       throw new AppError(error.message, 500);
    }
}

exports.getPaymentStatus=async(orderId,)=>{
    try {
        const order=await Order.findOne({where:{orderId:orderId}});
        if(!order){
            throw new AppError('Order not found', 404);
        }
       
        const response=await cashfree.PGOrderFetchPayments(orderId);
        
        let getOrderResponse=response.data;
        let orderStatus;
        if(
            getOrderResponse.filter((transaction)=>transaction.payment_status==='SUCCESS')
            .length>0
        ){
            orderStatus='success';
           
        const updateUser=await User.update({isPremium:true},
            {
                where:{
                    email:order.email
                },
            },
        );
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
       return orderStatus;
    } catch (error) {
       console.log(error);
            if(error instanceof AppError){
              throw error;
            }
            throw new AppError(error.message, 500);
    }
}
