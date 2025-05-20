const {DataTypes}=require('sequelize');
const sequelize=require('../utils/db-connection');
const Expense=sequelize.define('Expenses',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    price:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    category:{
        type:DataTypes.ENUM('electronics','travel','food','shopping','party'),
        allowNull:false,
        
    }
})


module.exports=Expense;