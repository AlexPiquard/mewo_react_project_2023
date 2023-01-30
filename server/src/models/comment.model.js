const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Discussion = require('./discussion.model');
const User = require('./user.model');

/**
 * @typedef Comment
 */
const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Content cannot be null',
      },
      notEmpty: {
        msg: 'Content cannot be empty',
      },
    },
  },
});

Comment.belongsTo(User, { foreignKey: 'userId', as: 'user', allowNull: false });
User.hasMany(Comment, { foreignKey: 'userId' });

Comment.belongsTo(Discussion, { foreignKey: 'discussionId', allowNull: false });
Discussion.hasMany(Comment, { foreignKey: 'discussionId', as: 'comments' });

Comment.prototype.toJSON = function () {
  const values = { ...this.get() };

  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = Comment;
