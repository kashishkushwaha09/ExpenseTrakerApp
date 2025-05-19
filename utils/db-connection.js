const {Sequelize}=require('sequelize');
const sequelize=new Sequelize('expansetrackerapp','root','Khush@123',{
    host:'localhost',
    dialect:'mysql'
});
(
    async()=>{
try {
    await sequelize.authenticate();
    console.log("connection to db has been created");
} catch (error) {
    console.log(error);
}
    }
)();

module.exports=sequelize;