const express=require('express');
const router=express.Router();
const expenseController=require('../controllers/expenseController');
const authenticateUser=require('../middlewares/auth');
router.get('/',authenticateUser,expenseController.getExpensesByPage);
// router.get('/',authenticateUser,expenseController.getExpense);
router.get('/premium/download',authenticateUser,expenseController.getReportDownload);
router.get('/premium/older-files/download',authenticateUser,expenseController.getOlderFiles);
router.get('/premium/leaderboard',authenticateUser,expenseController.showLeaderboard);
// router.get('/premium/report',authenticateUser,expenseController.groupExpenses);
router.post('/',authenticateUser,expenseController.addExpense);
router.delete('/:id',authenticateUser,expenseController.deleteExpense);





module.exports=router;