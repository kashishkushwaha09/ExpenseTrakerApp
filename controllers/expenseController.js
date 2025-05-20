const Expense=require('../models/expenseModel');

const addExpense=async(req,res)=>{
    try {
       const {price,description,category}=req.body;
const newExpese=await Expense.create({
    price,description,category
})
res.status(201).json({message:"expense created successfully", expense:newExpese}); 
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }

}
const getExpense=async(req,res)=>{
    try {
const expenses=await Expense.findAll();
res.status(200).json({message:"got all expenses successfully",expenses}); 
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }

}



module.exports={
    addExpense,getExpense
}