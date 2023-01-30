const faker = require('faker');
const Discussion = require('../../src/models/discussion.model');

const discussionOne = {
  id: 1,
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
};

const discussionTwo = {
  id: 2,
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
};

const insertDiscussions = async (discussions) => {
  await Discussion.bulkCreate(discussions);
};

const addUsersToDiscussions = async (users, discussions) => {
  await Promise.all(
    discussions.map((discussion) => {
      return Discussion.findOne({ where: { id: discussion.id } }).then((d) => d.addUsers(users.map((user) => user.id)));
    })
  );
};

module.exports = {
  discussionOne,
  discussionTwo,
  insertDiscussions,
  addUsersToDiscussions,
};
