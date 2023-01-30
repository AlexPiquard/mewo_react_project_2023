const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const discussionValidation = require('../../validations/discussion.validation');
const discussionController = require('../../controllers/discussion.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(discussionValidation.createDiscussion), discussionController.createDiscussion)
  .get(auth(), discussionController.getDiscussions);

router.route('/:discussionId').get(auth(), validate(discussionValidation.getDiscussion), discussionController.getDiscussion);

router
  .route('/:discussionId/comments')
  .get(auth(), validate(discussionValidation.getDiscussionComments), discussionController.getDiscussionComments);

module.exports = router;

/**
 * @swagger
 * tags:
 *  name: Discussions
 *  description: Discussion management and retrieval
 */

/**
 * @swagger
 * /discussions:
 *   post:
 *     summary: Create a discussion
 *     description: Only authenticated users can create discussions.
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - userIds
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the discussion.
 *                 example: How to create a discussion?
 *                 required: true
 *               description:
 *                 type: string
 *                 description: The description of the discussion.
 *                 example: I want to create a discussion.
 *                 required: true
 *             userIds:
 *               type: array
 *               description: The users that are part of the discussion.
 *               example: [1, 2, 3]
 *               required: true
 *               items:
 *                 type: integer
 *                 format: int64
 *                 minimum: 1
 *                 description: The id of the user.
 *                 example: 1
 *                 required: true
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discussion'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *   get:
 *     summary: Get all discussions
 *     description: Only authenticated users can retrieve discussions.
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Discussion'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /discussions/{id}:
 *   get:
 *     summary: Get a discussion
 *     description: Only authenticated users can retrieve discussions.
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The discussion id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discussion'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /discussions/{id}/comments:
 *   get:
 *     summary: Get a discussion comments
 *     description: Only authenticated users can retrieve discussions.
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The discussion id
 *         example: 1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
