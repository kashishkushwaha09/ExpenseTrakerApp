const express=require('express');
const cors=require('cors');
const app=express();
const db=require('./utils/db-connection');
const userRoutes=require('./routes/userRoutes');
const expenseRoutes=require('./routes/expenseRoutes');
const User= require('./models/userModel');
const Expense=require('./models/expenseModel');

app.use(express.static('public'));
app.use(express.json());
app.use(cors())
app.use('/api/users', userRoutes);
app.use('/api/expenses',expenseRoutes);

db.sync({alter:true}).then(()=>{
    app.listen(4000,()=>{
    console.log("server is listening on port 4000");
})
})
.catch((err)=>{
    console.log(err);
})