const { Op } = require('sequelize');
const sequelize = require('../utils/db-connection');
const db = require('../models');
const Expense = db.Expenses;
const User=db.Users;
const OlderFile=db.OlderFiles;

const userService = require('../services/userService');
const awsService = require('../services/awsService');
const { AppError } = require('../utils/appError');


const addExpense=async(expenseObj)=>{
    const transaction=await sequelize.transaction();
    try {
       const {amount,description,category,note,UserId}=expenseObj;
       let type= 'expense';
       if(category==='salary'){
           type='income';
       }
const newExpense=await Expense.create({
    amount,description,category,note,type,UserId
},
{transaction:transaction}
);

const existingUser=await userService.getUserById(UserId,
    {transaction:transaction});
if(existingUser && type==='expense'){
    existingUser.totalExpense = (existingUser.totalExpense || 0) + Number(amount);
    await existingUser.save(
        {transaction:transaction}
    );
}else{
    throw new AppError("User not found or invalid expense type", 404);
}
await transaction.commit();
return newExpense; 
    } catch (error) {
        await transaction.rollback();
        console.log(error);
             if(error instanceof AppError){
               throw error;
             }
             throw new AppError(error.message, 500);
    }

}
const findAllExpenses=async(userId)=>{
    try {
        const expenses=await Expense.findAll({where:{UserId:userId}});
        return expenses;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

const deleteExpense=async(id,userId)=>{
    const transaction=await sequelize.transaction();
    try {
        const expense=await Expense.findByPk(id,{transaction:transaction});
        const existingUser=await User.findByPk(userId,
    {transaction:transaction}
);
if(existingUser && expense && expense.type==='expense'){
    existingUser.totalExpense = (existingUser.totalExpense || 0) - expense.amount                                                                                                                                                                                                                                               ;
    await existingUser.save(
        {transaction:transaction}
    );
}else{
    throw new AppError("User not found or invalid expense type", 404);
}
        const deleted=await Expense.destroy({where:{id}},{transaction:transaction});
        await transaction.commit();
          if(deleted){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        await transaction.rollback();
       console.log(error);
            if(error instanceof AppError){
              throw error;
            }
            throw new AppError(error.message, 500);
    }
}
const showLeaderboard=async()=>{
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
return expenses;
    }catch(error){
        console.log(error);
        throw new AppError(error.message, 500);
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
const getExpensesByPage=async(page=1,limit=4,userId)=>{
    try {
      
        const expenses=await Expense.findAll({
            offset:(page-1)*limit,
            limit:limit,
        where:{UserId:userId}
        })
         const totalExpenses=expenses.length;
        console.log("totalExpenses ",expenses);
       return {
            expenses,
            currentPage:page,
            hasNextPage:(page*limit)<totalExpenses,
            hasPreviousPage:page>1,
            lastPage:Math.ceil(totalExpenses/limit),
            nextPage:page+1,
            previousPage:page-1
       };
    } catch (error) {
        console.log(error);
        throw new AppError(error.message, 500);
    }
}

const getReportDownload=async(userId)=>{
    try {
        const existingUser=await User.findByPk(userId);
    if(existingUser && existingUser.isPremium){
        const expenses=await Expense.findAll({
            where:{UserId:userId},
            attributes:['id','amount','description','category','type',
            [
                sequelize.fn('date_format', sequelize.col('updatedAt'), '%d-%m-%y'), 'date'
            ]],
            order:[['updatedAt','ASC']],
            raw:true
        });
        const stringifiedExpenses=JSON.stringify(expenses);
        // it should depend on user name or user id
        const fileName=`ExpenseReport-${userId}-${new Date().toISOString()}.txt`;
        const response=await awsService.uploadToS3(stringifiedExpenses,fileName);
        // table OlderFiles modification
        const olderFile=await OlderFile.create({
            fileName:fileName,
            filePath:response.Location,
            UserId:userId
        });
        return response.Location;
    
    }
    else{
        throw new AppError("User not found", 404);
    }
} catch (error) {
       console.log(error);
            if(error instanceof AppError){
              throw error;
            }
            throw new AppError(error.message, 500);
    }
}
const getOlderFiles=async(userId)=>{
    try {
        const existingUser=await User.findByPk(userId,
   
);
    if(existingUser && existingUser.isPremium){
        const olderFiles=await OlderFile.findAll({
            where:{UserId:userId},
            attributes:['id','fileName','filePath'],
            order:[['createdAt','DESC']],
            raw:true
        });
        return olderFiles;
    }else{
        throw new AppError("User not found", 404);
    }

    } catch (error) {
        console.log(error);
             if(error instanceof AppError){
               throw error;
             }
             throw new AppError(error.message, 500);
    }
}
module.exports={
    addExpense,findAllExpenses,getExpensesByPage, deleteExpense, showLeaderboard,groupExpenses,getReportDownload,getOlderFiles
}