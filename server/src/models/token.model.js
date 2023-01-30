const { DataTypes } = require('sequelize');
const { tokenTypes } = require('../config/tokens');
const sequelize = require('../config/database');
const User = require('./user.model');

/**
 * @typedef Token
 */
const Token = sequelize.define(
  'Token',
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(tokenTypes)],
      },
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [
      {
        fields: ['token'],
        unique: true,
      },
    ],
  }
);

Token.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Token, { foreignKey: 'userId' });

module.exports = Token;
