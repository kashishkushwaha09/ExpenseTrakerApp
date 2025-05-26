const {DataTypes}=require('sequelize');
const sequelize=require('../utils/db-connection');
const Expense=sequelize.define('Expenses',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false
  },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    category:{
        type:DataTypes.ENUM('transport','salary','food','shopping','party','health','education','housing','bills','entertainment','miscellaneous'),
        allowNull:false,
        
    },
    
})


module.exports=Expense;