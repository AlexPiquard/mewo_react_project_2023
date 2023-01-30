const Joi = require('joi');

const createDiscussion = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    userIds: Joi.array().items(Joi.number().required()).required(),
  }),
};

const getDiscussion = {
  params: Joi.object().keys({
    discussionId: Joi.number().required(),
  }),
};

const getDiscussionComments = {
  params: Joi.object().keys({
    discussionId: Joi.number().required(),
  }),
};

module.exports = {
  createDiscussion,
  getDiscussion,
  getDiscussionComments,
};
