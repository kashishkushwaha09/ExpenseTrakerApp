const express=require('express');
const router=express.Router();
const expenseController=require('../controllers/expenseController');
const authenticateUser=require('../middlewares/auth');
router.get('/',authenticateUser,expenseController.getExpense);
router.post('/',authenticateUser,expenseController.addExpense);
router.delete('/:id',authenticateUser,expenseController.deleteExpense);





module.exports=router;