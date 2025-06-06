const expenseService = require('../services/expenseService');
const { AppError } = require('../utils/appError');
const addExpense = async (req, res) => {
    try {
        const { amount, description, category, note } = req.body;
        const newExpense = await expenseService.addExpense({
            amount,
            description,
            category,
            note,
            UserId: req.user.id
        });
        res.status(201).json({ message: "expense created successfully", expense: newExpense });
    } catch (error) {
       
        console.log(error);
        throw new AppError(error.message, 500);
    }

}

const getExpense = async (req, res) => {
    try {
        const expenses = await expenseService.findAllExpenses(req.user.id);
        if (!expenses || expenses.length === 0) {
            throw new AppError("No expenses found for this user", 404);
        }
        res.status(200).json({ message: "got all expenses successfully", expenses });
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message, 500);
    }

}
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await expenseService.deleteExpense(id, req.user.id);
        if (deleted) {
            res.status(200).json({ message: 'Expense deleted Successfully!' });
        } else {
            throw new AppError("Expense not found", 404);
        }
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message, 500);
    }
}
const showLeaderboard = async (req, res) => {
    try {
        const expenses = await expenseService.showLeaderboard();
        if (!expenses || expenses.length === 0) {
            throw new AppError("No expenses found for any user", 404);
        }
        // sort the expenses by totalExpense in descending order
        expenses.sort((a, b) => b.totalExpense - a.totalExpense);

        res.status(200).json({ message: "got all expenses successfully", expenses });
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message, 500);
    }
}

const getExpensesByPage = async (req, res) => {
    try {
        const page = +req.query.page || 1;
        const itemPerPage = +req.query.limit || 4;
        const totalExpenses = await expenseService.getExpensesByPage(page, itemPerPage, req.user.id);
        res.status(200).json({
            message: "got all expenses successfully",
            expenses: totalExpenses,

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getReportDownload = async (req, res) => {
    try {
        const fileUrl = await expenseService.getReportDownload(req.user.id);
        if (!fileUrl) {
            throw new AppError("No report found for this user", 404);
        }
        res.status(200).json({ fileUrl, success: true });

    } catch (error) {
        console.log(error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message, 500);
    }
}
const getOlderFiles = async (req, res) => {
    try {
        const olderFiles = await expenseService.getOlderFiles(req.user.id);
        if (olderFiles) {
            return res.status(200).json({ olderFiles, success: true });
        } else {
            throw new AppError("Unauthorized", 401);
        }

    } catch (error) {
       console.log(error);
             if(error instanceof AppError){
               throw error;
             }
             throw new AppError(error.message, 500);
    }
}
const groupExpenses=async (req,res)=>{
    try {
        const {viewMode}=req.query;
        const allExpenses=await expenseService.groupExpenses(viewMode);
        return res.status(200).json({allExpenses});
    } catch (error) {
        console.log(error);
             if(error instanceof AppError){
               throw error;
             }
             throw new AppError(error.message, 500);
    }
}
module.exports = {
    addExpense, getExpense, groupExpenses, getExpensesByPage, deleteExpense, showLeaderboard, getReportDownload, getOlderFiles
}