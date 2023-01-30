const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @returns {Promise<User[]>}
 */
const queryUsers = async () => {
  return User.findAll();
};

/**
 * Get user by id
 * @param {Number} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findOne({ where: { id } });
};

/**
 * Get users by ids
 * @param {Array<Number>} ids
 * @returns {Promise<User[]>}
 */
const getUsersByIds = async (ids) => {
  return User.findAll({ where: { id: ids } });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

/**
 * Update user by id
 * @param {Number} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  await user.update(updateBody);
  return user;
};

/**
 * Delete user by id
 * @param {Number} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.destroy();
  return user;
};

const getUserDiscussions = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user.getDiscussions().then((discussions) =>
    discussions.map((discussion) => ({
      id: discussion.id,
      title: discussion.title,
      description: discussion.description,
    }))
  );
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUsersByIds,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserDiscussions,
};
