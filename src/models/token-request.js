module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'TokenRequests',
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
      },
      user_uuid: {
        type: DataTypes.UUID
      },
      fullName: { 
        type: DataTypes.STRING 
      },
      email: { 
        type: DataTypes.STRING 
      },
      company: { 
        type: DataTypes.STRING 
      },
      countryInput: { 
        type: DataTypes.STRING 
      },
      countryIp: { 
        type: DataTypes.STRING 
      },
      usCitizen: { 
        type: DataTypes.BOOLEAN 
      },
      chainAddress: { 
        type: DataTypes.STRING 
      },
      txAmount: { 
        type: DataTypes.STRING 
      },
      txHash: { 
        type: DataTypes.STRING 
      },
      completed: { 
        type: DataTypes.BOOLEAN
      }
    },
    {
      underscored: true
    }
  );
  return User;
};
