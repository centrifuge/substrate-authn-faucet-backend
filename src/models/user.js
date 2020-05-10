module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'Users',
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
      },
      githubUserName: { type: DataTypes.STRING },
      lastRequestTime: {
        type: DataTypes.DATE
      }
    },
    {
      underscored: true
    }
  );
  return User;
};
