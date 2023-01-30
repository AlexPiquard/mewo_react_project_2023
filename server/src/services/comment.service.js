const { Comment } = require('../models');

/**
 * Create a comment
 * @param {Object} commentBody
 * @returns {Promise<Comment>}
 */
const createComment = async (commentBody) => {
  const comment = await Comment.create(commentBody);
  const discussion = await comment.getDiscussion();
  const user = await comment.getUser();

  return {
    id: comment.id,
    content: comment.content,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    discussion: {
      id: discussion.id,
      title: discussion.title,
      description: discussion.description,
    },
  };
};

module.exports = {
  createComment,
};
