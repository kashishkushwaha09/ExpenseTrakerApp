require('dotenv').config();
const fs=require('fs');
const path=require('path');
const express=require('express');
const cors=require('cors');
const app=express();
const db=require('./utils/db-connection');
const userRoutes=require('./routes/userRoutes');
const expenseRoutes=require('./routes/expenseRoutes');
const Order=require('./models/orderModel');
const paymentRoutes=require('./routes/paymentRoutes');
const passwordRoutes=require('./routes/passwordRoutes');
const db2 = require('./models'); 
const morgan=require('morgan');
const errorMiddleware=require('./middlewares/errorHandler');

const accessLogStream=fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flag:'a'}
);
app.use(express.static('public'));
app.use(express.json());
app.use(cors())
app.use(morgan('combined',{stream:accessLogStream}))
app.use('/api/users', userRoutes);
app.use('/api/expenses',expenseRoutes);
app.use('/payment',paymentRoutes);
app.use('/password',passwordRoutes);
app.use(errorMiddleware);

db.sync({alter:true}).then(()=>{
    app.listen(process.env.DB_PORT || 4000,()=>{
    console.log("server is listening on port 4000");
    console.log("adding more logs");
})
})
.catch((err)=>{
    console.log(err);
})