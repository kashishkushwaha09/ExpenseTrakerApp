const User=require('../models/userModel');
const Expense=require('../models/expenseModel');
const ForgotPasswordRequest=require('../models/forgotPasswordRequests');

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);
module.exports={
    User, Expense,ForgotPasswordRequest
}