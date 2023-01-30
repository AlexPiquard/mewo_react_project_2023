const bcrypt = require('bcryptjs');
const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');
const { roles } = require('../config/roles');

/**
 * @typedef User
 */
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Name cannot be null',
      },
      notEmpty: {
        msg: 'Name cannot be empty',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    validate: {
      len: [8, +Infinity],
      containsNumberAndLetter(value) {
        if (!value.match(/.*[0-9].*/) || !value.match(/.*[a-zA-Z].*/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
    validate: {
      isIn: [roles],
    },
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

User.prototype.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

User.isEmailTaken = async function (email, excludeUserId) {
  if (excludeUserId) {
    const user = await User.findOne({
      where: {
        id: {
          [Op.ne]: excludeUserId,
        },
        email,
      },
    });
    return !!user;
  }
  const user = await User.findOne({ where: { email } });
  return !!user;
};

User.beforeSave(async (user) => {
  if (user.changed('password')) {
    // eslint-disable-next-line no-param-reassign
    user.password = await bcrypt.hash(user.password, 8);
  }
});

User.prototype.toJSON = function () {
  const values = { ...this.get() };

  delete values.password;
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = User;
