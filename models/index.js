const User=require('../models/userModel');
const Expense=require('../models/expenseModel');

User.hasMany(Expense);
Expense.belongsTo(User);


module.exports={
    User, Expense
}