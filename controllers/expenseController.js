const User = require('../models/userModel');
const Expense=require('../models/expenseModel');
const sequelize = require('../utils/db-connection');

const addExpense=async(req,res)=>{
    const transaction=await sequelize.transaction();
    try {
        
       const {price,description,category}=req.body;
       console.log(req.user);
const newExpese=await Expense.create({
    price,description,category,UserId:(req.user.id)
},
{transaction:transaction}
);
// throw new Error();
const existingUser=await User.findByPk(req.user.id,
    {transaction:transaction}
);
if(existingUser){
    existingUser.totalExpense = (existingUser.totalExpense || 0) + Number(price);
    await existingUser.save(
        {transaction:transaction}
    );
}else{
    console.log("in addExpense User not found")
}
await transaction.commit();
res.status(201).json({message:"expense created successfully", expense:newExpese}); 
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
if(existingUser && expense){
    existingUser.totalExpense = (existingUser.totalExpense || 0) - expense.price;
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

module.exports={
    addExpense,getExpense, deleteExpense, showLeaderboard
}