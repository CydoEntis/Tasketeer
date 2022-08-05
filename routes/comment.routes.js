const express = require('express');
const { body } = require('express-validator');

const commentController = require('../controllers/comment/comment.controller');
const { isAuth } = require('../middleware/auth.middleware');

const commentRoutes = express.Router();

commentRoutes.post(
	'/post-comment',
	isAuth,
	[body('comment').isString().isLength({ min: 3 }).trim()],
	commentController.postComment
);

commentRoutes.post('/comment-delete', commentController.postDeleteComment);

module.exports = commentRoutes;
