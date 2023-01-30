const { Comment, Discussion, User } = require('../models');

/**
 * Get discussion by id
 * @param {Number} id
 * @returns {Promise<Discussion>}
 */
const getDiscussionById = async (id) => {
  return Discussion.findOne({ where: { id } });
};

const getDiscussionsForUser = async (userId) => {
  const discussions = await Discussion.findAll({
    include: [
      {
        model: User,
        as: 'users',
        where: { id: userId },
        attributes: [],
      },
    ],
  });

  return discussions.map((discussion) => ({
    id: discussion.id,
    title: discussion.title,
    description: discussion.description,
  }));
};

/**
 * Get discussion users
 * @param {Number} discussionId
 * @returns {Promise<User[]>}
 */
const getDiscussionUsers = async (discussionId) => {
  const discussion = await Discussion.findOne({
    where: { id: discussionId },
    include: [
      {
        model: User,
        as: 'users',
        attributes: ['id', 'name', 'email'],
      },
    ],
  });

  return discussion.users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));
};

/**
 * Create a discussion
 @param {Object} discussionBody
 * @param {Array<Number>} userIds
 * @returns {Promise<Discussion>}
 */
const createDiscussion = async (discussionBody, userIds) => {
  const discussion = await Discussion.create(discussionBody);
  await discussion.addUsers(userIds);
  return {
    id: discussion.id,
    title: discussion.title,
    description: discussion.description,
    users: await discussion.getUsers().then((users) =>
      users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      }))
    ),
  };
};

const getDiscussionComments = async (discussionId) => {
  const discussion = await Discussion.findOne({
    where: { id: discussionId },
    include: [
      {
        model: Comment,
        as: 'comments',
        attributes: ['id', 'content', 'createdAt'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
      },
    ],
  });

  return discussion.comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    user: {
      id: comment.user.id,
      name: comment.user.name,
      email: comment.user.email,
    },
  }));
};

module.exports = {
  getDiscussionsForUser,
  getDiscussionById,
  getDiscussionUsers,
  createDiscussion,
  getDiscussionComments,
};
