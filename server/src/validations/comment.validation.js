const Joi = require('joi');

const createComment = {
  body: Joi.object().keys({
    content: Joi.string().required(),
    discussionId: Joi.number().required(),
  }),
};

module.exports = {
  createComment,
};
