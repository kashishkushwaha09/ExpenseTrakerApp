const {DataTypes}=require('sequelize');
const sequelize= require('../utils/db-connection')

const ForgotPasswordRequest=sequelize.define('ForgotPasswordRequests',{
    id:{
        type:DataTypes.STRING,
        primaryKey:true,
        allowNull:false
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }
})
module.exports=ForgotPasswordRequest;