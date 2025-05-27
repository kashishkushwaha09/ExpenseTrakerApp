const { Op } = require('sequelize');
// const User = require('../models/userModel');
// const Expense=require('../models/expenseModel');
const sequelize = require('../utils/db-connection');
const db = require('../models');
const Expense = db.Expenses;
const User=db.Users;
console.log(User);
const addExpense=async(req,res)=>{
    const transaction=await sequelize.transaction();
    try {
        console.log(Expense);
        console.log(User);
       const {amount,description,category,note}=req.body;
       console.log(req.user);
       let type= 'expense';
       if(category==='salary'){
           type='income';
       }
const newExpense=await Expense.create({
    amount,description,category,UserId:(req.user.id),type,note
},
{transaction:transaction}
);
// throw new Error();
const existingUser=await User.findByPk(req.user.id,
    {transaction:transaction}
);
if(existingUser && type==='expense'){
    existingUser.totalExpense = (existingUser.totalExpense || 0) + Number(amount);
    await existingUser.save(
        {transaction:transaction}
    );
}else{
    console.log("in addExpense User not found")
}
await transaction.commit();
res.status(201).json({message:"expense created successfully", expense:newExpense}); 
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        res.status(500).json({message:error.message});
    }

}
const getExpense=async(req,res)=>{
    try {
const expenses=await Expense.findAll({where:{UserId:req.user.id}});
res.status(200).json({message:"got all expenses successfully",expenses}); 
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }

}
const deleteExpense=async(req,res)=>{
    const transaction=await sequelize.transaction();
    try {
        const {id}=req.params;
        const expense=await Expense.findByPk(id,{transaction:transaction});

        const existingUser=await User.findByPk(req.user.id,
    {transaction:transaction}
);
if(existingUser && expense && expense.type==='expense'){
    existingUser.totalExpense = (existingUser.totalExpense || 0) - expense.amount                                                                                                                                                                                                                                               ;
    await existingUser.save(
        {transaction:transaction}
    );
}else{
    console.log("User not found")
}
        const deleted=await Expense.destroy({where:{id}},{transaction:transaction});
        console.log(id);
        console.log(deleted);
        if(deleted){
            res.status(200).json({message:'Expense deleted Successfully!'});
        }else{
            res.status(404).json({message:'Expense not found'});
        }
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
         console.log(error);
        res.status(500).json({message:error.message});
    }
}
const showLeaderboard=async(req,res)=>{
    try{
const expenses=await User.findAll({
  attributes: [
    'id',
    'name',
   'totalExpense'
  ],
  order: [['totalExpense', 'DESC']],
});

// await Expense.findAll({
//     attributes:['UserId',[sequelize.fn('sum',sequelize.col('price')),'totalExpense']],
//     group:['UserId','User.id'],
//     include:[{
//         model:User,
//         attributes:['name']
//     }],
//     order:[[sequelize.fn('sum',sequelize.col('price')),'DESC']],
// })
res.status(200).json({message:"got all expenses successfully",expenses});
    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }
}
// premium features
const groupExpenses=async(req,res)=>{
    try {
        const month='04';
        const year='2025';
        const allExpenses=await Expense.findAll({
            attributes:['id','amount','description','category','type',
            [
                sequelize.fn('date_format', sequelize.col('updatedAt'), '%d-%m-%y'), 'date'
            ]],
            where:{UserId:req.user.id},
            order:[['updatedAt','ASC']],
            raw:true
        });
        const totalExpenses=await Expense.findAll({
    attributes:[[sequelize.fn('date_format', sequelize.col('updatedAt'), '%d-%m-%y'), 'date'],
    [sequelize.fn('sum',sequelize.literal(`CASE WHEN type='expense' THEN amount ELSE 0 END`)),'totalExpense'],
[sequelize.fn('sum',sequelize.literal(`CASE WHEN type='income' THEN amount ELSE 0 END`)),'totalIncome']],
    group:[sequelize.fn('date_format', sequelize.col('updatedAt'), '%d-%m-%y')],
    order:[[sequelize.fn('date_format', sequelize.col('updatedAt'), '%d-%m-%y'),'ASC']],
    where:{
        UserId:req.user.id,
        where: {
  UserId: req.user.id,
  [Op.and]: [
    sequelize.where(sequelize.fn('MONTH', sequelize.col('updatedAt')), month),
    sequelize.where(sequelize.fn('YEAR', sequelize.col('updatedAt')), year)
  ]
}
    },
    raw:true
})
const finalData=totalExpenses.map((expense)=>{
    const date=expense.date;
    const entriesOnThisDate=allExpenses.filter((e)=>e.date===date);
    return {
        ...expense,
        entries:entriesOnThisDate
    }
})
        res.status(200).json({message:"got all group expenses successfully",expenses:finalData});
    } catch (error) {
       console.log(error);
        res.status(500).json({message:error.message});  
    }
}
const getExpensesByPage=async(req,res)=>{
    try {
        const page=+req.query.page || 1;
        const itemPerPage=+req.query.limit || 4;
        const totalExpenses=await Expense.count();
        console.log("totalExpense ",totalExpenses);
        const expenses=await Expense.findAll({
            offset:(page-1)*itemPerPage,
            limit:itemPerPage,
        where:{UserId:req.user.id}
        })
        res.status(200).json({
            expenses,
            currentPage:page,
            hasNextPage:(page*itemPerPage)<totalExpenses,
            hasPreviousPage:page>1,
            lastPage:Math.ceil(totalExpenses/itemPerPage),
            nextPage:page+1,
            previousPage:page-1
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});  
    }
}
module.exports={
    addExpense,getExpense,getExpensesByPage, deleteExpense, showLeaderboard,groupExpenses
}