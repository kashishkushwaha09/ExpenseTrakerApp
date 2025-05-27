const {DataTypes}=require('sequelize');
const sequelize= require('../utils/db-connection')

module.exports=(sequelize,DataTypes)=>{
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
});
ForgotPasswordRequest.associate = (models) => {
    ForgotPasswordRequest.belongsTo(models.Users);
  };
return ForgotPasswordRequest;
}

