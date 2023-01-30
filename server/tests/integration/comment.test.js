const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { userOne, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const { discussionOne, discussionTwo, insertDiscussions, addUsersToDiscussions } = require('../fixtures/discussion.fixture');

setupTestDB();

describe('Comment routes', () => {
  describe('POST /v1/comments', () => {
    let newComment;

    beforeEach(() => {
      newComment = {
        content: faker.lorem.sentence(),
        discussionId: discussionOne.id,
      };
    });

    test('should return 201 and successfully create new comment if data is ok', async () => {
      await insertUsers([userOne]);
      await insertDiscussions([discussionOne]);
      await addUsersToDiscussions([userOne], [discussionOne]);

      const res = await request(app)
        .post('/v1/comments')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newComment)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        content: newComment.content,
        discussion: {
          id: discussionOne.id,
          title: discussionOne.title,
          description: discussionOne.description,
        },
        user: {
          id: userOne.id,
          name: userOne.name,
          email: userOne.email,
        },
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertDiscussions([discussionOne]);
      await addUsersToDiscussions([userOne], [discussionOne]);
      await request(app).post('/v1/comments').send(newComment).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if content is empty', async () => {
      await insertUsers([userOne]);
      await insertDiscussions([discussionOne]);
      await addUsersToDiscussions([userOne], [discussionOne]);

      newComment.content = '';

      await request(app)
        .post('/v1/comments')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newComment)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if discussionId is empty', async () => {
      await insertUsers([userOne]);
      newComment.discussionId = '';

      await request(app)
        .post('/v1/comments')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newComment)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 error if user is not a member of the discussion', async () => {
      await insertUsers([userOne]);
      await insertDiscussions([discussionOne, discussionTwo]);
      await addUsersToDiscussions([userOne], [discussionOne]);
      newComment.discussionId = discussionTwo.id;

      await request(app)
        .post('/v1/comments')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newComment)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error if discussion does not exist', async () => {
      await insertUsers([userOne]);
      newComment.discussionId = faker.datatype.number();

      await request(app)
        .post('/v1/comments')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newComment)
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
