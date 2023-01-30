const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');

/**
 * @typedef Discussion
 */
const Discussion = sequelize.define('Discussion', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Title cannot be null',
      },
      notEmpty: {
        msg: 'Title cannot be empty',
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Description cannot be null',
      },
      notEmpty: {
        msg: 'Description cannot be empty',
      },
    },
  },
});

Discussion.belongsToMany(User, { through: 'UserDiscussion', as: 'users', foreignKey: 'discussionId' });
User.belongsToMany(Discussion, { through: 'UserDiscussion', as: 'discussions', foreignKey: 'userId' });

Discussion.prototype.toJSON = function () {
  const values = { ...this.get() };

  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = Discussion;
