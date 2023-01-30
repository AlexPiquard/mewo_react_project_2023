const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { commentService, discussionService } = require('../services');

const createComment = catchAsync(async (req, res) => {
  const discussion = await discussionService.getDiscussionById(req.body.discussionId);
  if (!discussion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discussion not found');
  }

  const discussionUsers = await discussionService.getDiscussionUsers(req.body.discussionId);

  if (!discussionUsers.find((user) => user.id === req.user.id)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not allowed to create a comment in this discussion');
  }

  const comment = await commentService.createComment({ ...req.body, userId: req.user.id });
  res.status(httpStatus.CREATED).send(comment);
});

module.exports = {
  createComment,
};
