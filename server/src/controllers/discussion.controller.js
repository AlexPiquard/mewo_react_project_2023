const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { discussionService, userService } = require('../services');

const createDiscussion = catchAsync(async (req, res) => {
  const userIds = [req.user.id, ...req.body.userIds];

  if (req.body.userIds.includes(req.user.id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot add yourself to the discussion');
  }

  if (new Set(userIds).size !== userIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot add the same user twice');
  }

  if (userIds.length < 2) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Discussion must have at least 2 users');
  }

  const users = await userService.getUsersByIds(userIds);
  if (users.length !== userIds.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'One or more users not found');
  }

  const discussion = await discussionService.createDiscussion(req.body, userIds);
  res.status(httpStatus.CREATED).send(discussion);
});

const getDiscussions = catchAsync(async (req, res) => {
  const discussions = await discussionService.getDiscussionsForUser(req.user.id);
  res.send(discussions);
});

const getDiscussion = catchAsync(async (req, res) => {
  const discussion = await discussionService.getDiscussionById(req.params.discussionId);
  if (!discussion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discussion not found');
  }

  const discussionUsers = await discussionService.getDiscussionUsers(req.params.discussionId);

  if (req.user.role !== 'admin' && !discussionUsers.find((user) => user.id === req.user.id)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discussion not found');
  }

  res.send({
    id: discussion.id,
    title: discussion.title,
    description: discussion.description,
    users: discussionUsers,
  });
});

const getDiscussionComments = catchAsync(async (req, res) => {
  const discussion = await discussionService.getDiscussionById(req.params.discussionId);
  if (!discussion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discussion not found');
  }

  const discussionUsers = await discussionService.getDiscussionUsers(req.params.discussionId);

  if (req.user.role !== 'admin' && !discussionUsers.find((user) => user.id === req.user.id)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discussion not found');
  }

  const comments = await discussionService.getDiscussionComments(req.params.discussionId);
  res.send(comments);
});

module.exports = {
  createDiscussion,
  getDiscussions,
  getDiscussion,
  getDiscussionComments,
};
