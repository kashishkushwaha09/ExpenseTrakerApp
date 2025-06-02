
module.exports=(sequelize,DataTypes)=>{
const OlderFile=sequelize.define('OlderFiles',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: false
      }
});
  OlderFile.associate = (models) => {
    OlderFile.belongsTo(models.Users);
   
  };
return OlderFile;
}

