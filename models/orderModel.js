const {DataTypes}=require('sequelize');
const sequelize= require('../utils/db-connection')

const Order=sequelize.define('Orders',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    orderId:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:'pending'
    },
})
module.exports=Order;