const express=require('express');
const router=express.Router();
const expenseController=require('../controllers/expenseController');
router.get('/',expenseController.getExpense);
router.post('/',expenseController.addExpense);
router.delete('/:id',expenseController.deleteExpense);





module.exports=router;