
module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define('Otp', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    timestamps: false,
    indexes: [
      {
        fields: ['createdAt']
      }
    ],
  });
  
  return Otp;
}