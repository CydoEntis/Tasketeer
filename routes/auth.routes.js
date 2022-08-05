const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth/auth.controller');
const userModel = require('../models/user/user.model');

const authRoutes = express.Router();

authRoutes.get('/login', authController.getLogin);
authRoutes.post(
	'/login',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email or password')
			.normalizeEmail(),
		body('password', 'Please enter a valid email or password')
			.isLength({ min: 5 })
			.isAlphanumeric()
			.trim(),
	],
	authController.postLogin
);
authRoutes.post('/logout', authController.postLogout);
authRoutes.get('/signup', authController.getSignUp);
authRoutes.post(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email!')
			.custom((value, { req }) => {
				return userModel.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject(
							'Email already exists, please use a different one!'
						);
					}
				});
			})
			.normalizeEmail(),
		body(
			'password',
			'Please enter a password that uses only characters and numbers and is at least 5 characters long'
		)
			.isLength({ min: 5 })
			.isAlphanumeric()
			.trim(),
		body('confirmPassword')
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error('Passwords do not match');
				}
				return true;
			})
			.trim(),
	],
	authController.postSignUp
);

module.exports = authRoutes;
