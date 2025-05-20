const Expense=require('../models/expenseModel');

const addExpense=async(req,res)=>{
    try {
       const {price,description,category}=req.body;
       const userId=req.headers['user-id'];
       console.log("headers set  ",parseInt(userId));
const newExpese=await Expense.create({
    price,description,category,UserId:parseInt(userId)
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
const deleteExpense=async(req,res)=>{
    try {
        const {id}=req.params;
        const deleted=await Expense.destroy({where:{id}});
        console.log(id);
        console.log(deleted);
        if(deleted){
            res.status(200).json({message:'Expense deleted Successfully!'});
        }else{
            res.status(404).json({message:'Expense not found'});
        }
    } catch (error) {
         console.log(error);
        res.status(500).json({message:error.message});
    }
}


module.exports={
    addExpense,getExpense, deleteExpense
}