const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { discussionOne, discussionTwo, insertDiscussions, addUsersToDiscussions } = require('../fixtures/discussion.fixture');
const { commentOne, insertComments } = require('../fixtures/comment.fixture');

setupTestDB();

describe('Discussions routes', () => {
  describe('POST /v1/discussions', () => {
    let newDiscussion;

    beforeEach(() => {
      newDiscussion = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        userIds: [],
      };
    });

    test('should return 201 and successfully create new discussion if data is ok', async () => {
      await insertUsers([userOne, userTwo]);
      newDiscussion.userIds = [userTwo.id];

      const res = await request(app)
        .post('/v1/discussions')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newDiscussion)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        title: newDiscussion.title,
        description: newDiscussion.description,
        users: [
          {
            id: userOne.id,
            name: userOne.name,
            email: userOne.email,
          },
          {
            id: userTwo.id,
            name: userTwo.name,
            email: userTwo.email,
          },
        ],
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne, userTwo]);
      newDiscussion.userIds = [userTwo.id];
      await request(app).post('/v1/discussions').send(newDiscussion).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if title is empty', async () => {
      await insertUsers([userOne, userTwo]);
      newDiscussion.title = '';
      newDiscussion.userIds = [userTwo.id];
      await request(app)
        .post('/v1/discussions')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newDiscussion)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if description is empty', async () => {
      await insertUsers([userOne, userTwo]);
      newDiscussion.description = '';
      newDiscussion.userIds = [userTwo.id];
      await request(app)
        .post('/v1/discussions')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newDiscussion)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if userIds is empty', async () => {
      await insertUsers([userOne, userTwo]);
      newDiscussion.userIds = [];
      await request(app)
        .post('/v1/discussions')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newDiscussion)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if userIds contains invalid user id', async () => {
      await insertUsers([userOne, userTwo]);
      newDiscussion.userIds = [userTwo.id, faker.datatype.number()];
      await request(app)
        .post('/v1/discussions')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newDiscussion)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userIds contains duplicate user id', async () => {
      await insertUsers([userOne, userTwo]);
      newDiscussion.userIds = [userTwo.id, userTwo.id];
      await request(app)
        .post('/v1/discussions')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newDiscussion)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if userIds contains current user id', async () => {
      await insertUsers([userOne, userTwo]);
      newDiscussion.userIds = [userTwo.id, userOne.id];
      await request(app)
        .post('/v1/discussions')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newDiscussion)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/discussions/:discussionId', () => {
    test('should return 200 and the discussion object if data is ok', async () => {
      await insertUsers([userOne, userTwo]);
      await insertDiscussions([discussionOne]);
      await addUsersToDiscussions([userOne, userTwo], [discussionOne]);

      const res = await request(app)
        .get(`/v1/discussions/${discussionOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: discussionOne.id,
        title: discussionOne.title,
        description: discussionOne.description,
        users: [
          {
            id: userOne.id,
            name: userOne.name,
            email: userOne.email,
          },
          {
            id: userTwo.id,
            name: userTwo.name,
            email: userTwo.email,
          },
        ],
      });
    });

    test('should return 200 and the discussion if admin is requesting', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertDiscussions([discussionOne]);
      await addUsersToDiscussions([userOne, userTwo], [discussionOne]);

      const res = await request(app)
        .get(`/v1/discussions/${discussionOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: discussionOne.id,
        title: discussionOne.title,
        description: discussionOne.description,
        users: [
          {
            id: userOne.id,
            name: userOne.name,
            email: userOne.email,
          },
          {
            id: userTwo.id,
            name: userTwo.name,
            email: userTwo.email,
          },
        ],
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne, userTwo]);
      await insertDiscussions([discussionOne]);
      await addUsersToDiscussions([userOne, userTwo], [discussionOne]);

      await request(app).get(`/v1/discussions/${discussionOne.id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error if discussion is not found', async () => {
      await insertUsers([userOne, userTwo]);
      await insertDiscussions([discussionOne]);
      await addUsersToDiscussions([userOne, userTwo], [discussionOne]);

      await request(app)
        .get(`/v1/discussions/${faker.datatype.number()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 error if discussion does not belong to the user', async () => {
      await insertUsers([admin, userOne, userTwo]);
      await insertDiscussions([discussionOne]);
      await addUsersToDiscussions([admin, userTwo], [discussionOne]);

      await request(app)
        .get(`/v1/discussions/${discussionOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET /v1/discussions/:discussionId/comments', () => {
    test('should return 200 and the comments if data is ok', async () => {
      await insertUsers([userOne, userTwo]);
      await insertDiscussions([discussionOne]);
      await addUsersToDiscussions([userOne], [discussionOne]);
      await insertComments([commentOne], userOne.id, discussionOne.id);

      const res = await request(app)
        .get(`/v1/discussions/${discussionOne.id}/comments`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual([
        {
          id: commentOne.id,
          content: commentOne.content,
          user: {
            id: userOne.id,
            name: userOne.name,
            email: userOne.email,
          },
        },
      ]);
    });

    test('should return 200 and the comments if admin is requesting', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertDiscussions([discussionOne]);
      await addUsersToDiscussions([userOne], [discussionOne]);
      await insertComments([commentOne], userOne.id, discussionOne.id);

      const res = await request(app)
        .get(`/v1/discussions/${discussionOne.id}/comments`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual([
        {
          id: commentOne.id,
          content: commentOne.content,
          user: {
            id: userOne.id,
            name: userOne.name,
            email: userOne.email,
          },
        },
      ]);
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne, userTwo]);
      await insertDiscussions([discussionOne]);
      await addUsersToDiscussions([userOne], [discussionOne]);
      await insertComments([commentOne], userOne.id, discussionOne.id);

      await request(app).get(`/v1/discussions/${discussionOne.id}/comments`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error if discussion is not found', async () => {
      await insertUsers([userOne, userTwo]);
      await insertDiscussions([discussionOne]);
      await addUsersToDiscussions([userOne], [discussionOne]);
      await insertComments([commentOne], userOne.id, discussionOne.id);

      await request(app)
        .get(`/v1/discussions/${faker.datatype.number()}/comments`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 error if discussion does not belong to the user', async () => {
      await insertUsers([admin, userOne, userTwo]);
      await insertDiscussions([discussionOne]);
      await addUsersToDiscussions([admin, userTwo], [discussionOne]);
      await insertComments([commentOne], userOne.id, discussionOne.id);

      await request(app)
        .get(`/v1/discussions/${discussionOne.id}/comments`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 200 and an empty list if comment does not belong to the discussion', async () => {
      await insertUsers([userOne, userTwo]);
      await insertDiscussions([discussionOne, discussionTwo]);
      await addUsersToDiscussions([userOne], [discussionOne]);
      await insertComments([commentOne], userOne.id, discussionTwo.id);

      const res = await request(app)
        .get(`/v1/discussions/${discussionOne.id}/comments`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual([]);
    });
  });
});
