const faker = require('faker');
const Comment = require('../../src/models/comment.model');

const commentOne = {
  id: 1,
  content: faker.lorem.sentence(),
};

const commentTwo = {
  id: 2,
  content: faker.lorem.sentence(),
};

const insertComments = async (comments, userId, discussionId) => {
  await Comment.bulkCreate(comments.map((comment) => ({ ...comment, userId, discussionId })));
};

module.exports = {
  commentOne,
  commentTwo,
  insertComments,
};
