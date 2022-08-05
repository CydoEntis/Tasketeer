const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');

const taskModel = require('../../models/task/task.model');
const Task = require('../../models/task/task.model');
const User = require('../../models/user/user.model');
const Comment = require('../../models/comment/comment.model');
const { formatDate, shorten } = require('../../utils/util');
const { validationResult } = require('express-validator');
const Image = require('../../models/image/image.model');

const TASKS_PER_PAGE = 8;

async function getIndex(req, res, next) {
	const formattedTasks = [];
	const pendingTasks = [];
	const activeTasks = [];
	const onHoldTasks = [];
	const inReviewTasks = [];
	const completedTasks = [];

	const tasks = await Task.find({
		$or: [
			{ 'assignedTo.userId': ObjectId(req.user._id) },
			{ 'createdBy.userId': ObjectId(req.user._id) },
		],
	}).sort({ createdAt: -1 });

	let count = 0;
	for (let task of tasks) {
		const createdAtDate = formatDate(task.createdAt);
		const dueDate = formatDate(task.dueDate);
		const shortDesc = shorten(task.description);

		let formattedTask = {
			...task,
			createdAtDate,
			shortDesc,
			dueDate,
		};

		if (task.status === 'pending') {
			pendingTasks.push(formattedTask);
		} else if (task.status === 'active') {
			activeTasks.push(formattedTask);
		} else if (task.status === 'hold') {
			onHoldTasks.push(formattedTask);
		} else if (task.status === 'reviewing') {
			inReviewTasks.push(formattedTask);
		} else if (task.status === 'complete') {
			completedTasks.push(formattedTask);
		}

		if (count <= 4) {
			formattedTasks.push(formattedTask);
		}
		count++;
	}
	res.render('tasks/tasks', {
		tasks: {
			allTasks: formattedTasks,
			pendingTasks: pendingTasks,
			activeTasks: activeTasks,
			onHoldTasks: onHoldTasks,
			inReviewTasks: inReviewTasks,
			completedTasks: completedTasks,
		},
		title: 'Tasks',
		userId: req.user._id,
		activePage: '/tasks',
	});
}

async function getTasks(req, res, next) {
	const page = +req.query.page || 1;

	const formattedTasks = [];
	try {
		const numTasks = await Task.find({
			status: { $ne: 'pending' },
		}).countDocuments();

		const tasks = await Task.find({ status: { $ne: 'pending' } })
			.sort({
				createdAt: -1,
			})
			.skip((page - 1) * TASKS_PER_PAGE)
			.limit(TASKS_PER_PAGE);

		for (let task of tasks) {
			const formattedDate = formatDate(task.createdAt);
			const dueDate = formatDate(task.dueDate);
			let formattedDesc = task.description.substring(0, 50);
			if (formattedDesc.length >= 50) {
				formattedDesc += '...';
			}
			const formattedTask = {
				...task,
				createdAtDate: formattedDate,
				dueDate: dueDate,
				description: formattedDesc,
			};
			formattedTasks.push(formattedTask);
		}

		res.render('tasks/tasks-view', {
			tasks: formattedTasks,
			title: 'All Tasks',
			userId: req.user._id,
			activePage: '/tasks',
			currentPage: page,
			hasNextPage: TASKS_PER_PAGE * page < numTasks,
			hasPrevPage: page > 1,
			nextPage: page + 1,
			prevPage: page - 1,
			lastPage: Math.ceil(numTasks / TASKS_PER_PAGE),
		});
	} catch (err) {
		next(err);
	}
}

async function getPendingTasks(req, res, next) {
	const page = +req.query.page || 1;

	const formattedTasks = [];
	try {
		const numTasks = await Task.find({
			status: 'complete',
			'assignedTo.userId': ObjectId(req.user._id),
		}).countDocuments();

		const tasks = await Task.find({
			status: 'complete',
			'assignedTo.userId': ObjectId(req.user._id),
		})
			.sort({
				createdAt: -1,
			})
			.skip((page - 1) * TASKS_PER_PAGE)
			.limit(TASKS_PER_PAGE);

		for (let task of tasks) {
			const formattedDate = formatDate(task.createdAt);
			const dueDate = formatDate(task.dueDate);
			let formattedDesc = task.description.substring(0, 50);
			if (formattedDesc.length >= 50) {
				formattedDesc += '...';
			}
			const formattedTask = {
				...task,
				createdAt: formattedDate,
				dueDate: dueDate,
				description: formattedDesc,
			};
			formattedTasks.push(formattedTask);
		}
		res.render('tasks/tasks-view', {
			tasks: formattedTasks,
			title: 'Completed',
			userId: req.user._id,
			activePage: '/tasks',
			currentPage: page,
			hasNextPage: TASKS_PER_PAGE * page < numTasks,
			hasPrevPage: page > 1,
			nextPage: page + 1,
			prevPage: page - 1,
			lastPage: Math.ceil(numTasks / TASKS_PER_PAGE),
		});
	} catch (err) {
		next(err);
	}
}

async function getActiveTasks(req, res, next) {
	const page = +req.query.page || 1;

	const formattedTasks = [];
	try {
		const numTasks = await Task.find({
			status: 'active',
			'assignedTo.userId': ObjectId(req.user._id),
		}).countDocuments();

		const tasks = await Task.find({
			status: 'active',
			'assignedTo.userId': ObjectId(req.user._id),
		})
			.sort({
				createdAt: -1,
			})
			.skip((page - 1) * TASKS_PER_PAGE)
			.limit(TASKS_PER_PAGE);

		for (let task of tasks) {
			const formattedDate = formatDate(task.createdAt);
			const dueDate = formatDate(task.dueDate);
			let formattedDesc = task.description.substring(0, 50);
			if (formattedDesc.length >= 50) {
				formattedDesc += '...';
			}
			const formattedTask = {
				...task,
				createdAt: formattedDate,
				dueDate: dueDate,
				description: formattedDesc,
			};
			formattedTasks.push(formattedTask);
		}
		res.render('tasks/tasks-view', {
			tasks: formattedTasks,
			title: 'Active',
			userId: req.user._id,
			activePage: '/tasks',
			currentPage: page,
			hasNextPage: TASKS_PER_PAGE * page < numTasks,
			hasPrevPage: page > 1,
			nextPage: page + 1,
			prevPage: page - 1,
			lastPage: Math.ceil(numTasks / TASKS_PER_PAGE),
		});
	} catch (err) {
		next(err);
	}
}

async function postActiveTask(req, res, next) {
	const taskId = req.body.id;
	const task = await Task.findById(taskId);

	task.status = 'active';

	await task.save();

	res.redirect('/tasks');
}

async function getOnHoldTasks(req, res, next) {
	const page = +req.query.page || 1;

	const formattedTasks = [];
	try {
		const numTasks = await Task.find({
			status: 'hold',
			'assignedTo.userId': ObjectId(req.user._id),
		}).countDocuments();

		const tasks = await Task.find({
			status: 'hold',
			'assignedTo.userId': ObjectId(req.user._id),
		})
			.sort({
				createdAt: -1,
			})
			.skip((page - 1) * TASKS_PER_PAGE)
			.limit(TASKS_PER_PAGE);

		for (let task of tasks) {
			const formattedDate = formatDate(task.createdAt);
			const dueDate = formatDate(task.dueDate);
			let formattedDesc = task.description.substring(0, 50);
			if (formattedDesc.length >= 50) {
				formattedDesc += '...';
			}
			const formattedTask = {
				...task,
				createdAt: formattedDate,
				dueDate: dueDate,
				description: formattedDesc,
			};
			formattedTasks.push(formattedTask);
		}
		res.render('tasks/tasks-view', {
			tasks: formattedTasks,
			title: 'On Hold',
			userId: req.user._id,
			activePage: '/tasks',
			currentPage: page,
			hasNextPage: TASKS_PER_PAGE * page < numTasks,
			hasPrevPage: page > 1,
			nextPage: page + 1,
			prevPage: page - 1,
			lastPage: Math.ceil(numTasks / TASKS_PER_PAGE),
		});
	} catch (err) {
		next(err);
	}
}

async function postHoldTask(req, res, next) {
	const taskId = req.body.id;
	const task = await Task.findById(taskId);

	task.status = 'hold';

	await task.save();

	res.redirect('/admin/tasks');
}

async function getInReviewTasks(req, res, next) {
	const page = +req.query.page || 1;

	const formattedTasks = [];
	try {
		const numTasks = await Task.find({
			status: 'reviewing',
			'assignedTo.userId': ObjectId(req.user._id),
		}).countDocuments();

		const tasks = await Task.find({
			status: 'complete',
			'assignedTo.userId': ObjectId(req.user._id),
		})
			.sort({
				createdAt: -1,
			})
			.skip((page - 1) * TASKS_PER_PAGE)
			.limit(TASKS_PER_PAGE);

		for (let task of tasks) {
			const formattedDate = formatDate(task.createdAt);
			const dueDate = formatDate(task.dueDate);
			let formattedDesc = task.description.substring(0, 50);
			if (formattedDesc.length >= 50) {
				formattedDesc += '...';
			}
			const formattedTask = {
				...task,
				createdAt: formattedDate,
				dueDate: dueDate,
				description: formattedDesc,
			};
			formattedTasks.push(formattedTask);
		}
		res.render('tasks/tasks-view', {
			tasks: formattedTasks,
			title: 'Completed',
			userId: req.user._id,
			activePage: '/tasks',
			currentPage: page,
			hasNextPage: TASKS_PER_PAGE * page < numTasks,
			hasPrevPage: page > 1,
			nextPage: page + 1,
			prevPage: page - 1,
			lastPage: Math.ceil(numTasks / TASKS_PER_PAGE),
		});
	} catch (err) {
		next(err);
	}
}

async function getCompletedTasks(req, res, next) {
	const page = +req.query.page || 1;

	const formattedTasks = [];
	try {
		const numTasks = await Task.find({
			status: 'complete',
			'assignedTo.userId': ObjectId(req.user._id),
		}).countDocuments();

		const tasks = await Task.find({
			status: 'complete',
			'assignedTo.userId': ObjectId(req.user._id),
		})
			.sort({
				createdAt: -1,
			})
			.skip((page - 1) * TASKS_PER_PAGE)
			.limit(TASKS_PER_PAGE);

		for (let task of tasks) {
			const formattedDate = formatDate(task.createdAt);
			const dueDate = formatDate(task.dueDate);
			let formattedDesc = task.description.substring(0, 50);
			if (formattedDesc.length >= 50) {
				formattedDesc += '...';
			}
			const formattedTask = {
				...task,
				createdAt: formattedDate,
				dueDate: dueDate,
				description: formattedDesc,
			};
			formattedTasks.push(formattedTask);
		}
		res.render('tasks/tasks-view', {
			tasks: formattedTasks,
			title: 'Completed',
			userId: req.user._id,
			activePage: '/tasks',
			currentPage: page,
			hasNextPage: TASKS_PER_PAGE * page < numTasks,
			hasPrevPage: page > 1,
			nextPage: page + 1,
			prevPage: page - 1,
			lastPage: Math.ceil(numTasks / TASKS_PER_PAGE),
		});
	} catch (err) {
		next(err);
	}
}

async function getTask(req, res, next) {
	const taskId = req.params.id;
	const task = await Task.findById(taskId);
	const comments = await Comment.find({ taskId: taskId }).sort({
		createdAt: -1,
	});

	const formattedDate = formatDate(task.createdAt);
	const dueDate = formatDate(task.dueDate);

	const images = [];
	for (let imageId of task.imageIds) {
		const foundImage = await Image.findById(imageId);
		images.push(foundImage);
	}

	const foundTask = {
		...task,
		createdAt: formattedDate,
		dueDate: dueDate,
	};

	const formattedComments = [];

	for (let comment of comments) {
		commentDate = formatDate(comment.createdAt);
		const formattedComment = {
			...comment,
			createdAt: commentDate,
			dueDate: dueDate,
		};
		formattedComments.push(formattedComment);
	}
	res.render('tasks/task', {
		task: foundTask,
		images: images,
		user: req.user,
		comments: formattedComments,
		activePage: '/tasks',
	});
}

function getCreateTask(req, res, next) {
	res.render('tasks/create-task', {
		pageTitle: 'Create Task',
		errorMessage: null,
		validationErrors: [],
		activePage: '/tasks',
	});
}

async function postCreateTask(req, res, next) {
	const title = req.body.title;
	const description = req.body.description;
	const images = req.files;

	const imageIds = [];
	try {
		for (let image of images) {
			const newImage = new Image({
				name: image.filename,
				path: image.path,
			});
			imageIds.push(newImage);
			await newImage.save();
		}
	} catch (e) {
		console.log(e);
	}

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render('tasks/create-task', {
			activePage: '/tasks',
			pageTitle: 'Create Task',
			title: title,
			severity: undefined,
			description: description,
			createdBy: {
				username: req.user.username,
				userId: req.user,
			},
			status: 'pending',
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}

	const task = new Task({
		title: title,
		severity: undefined,
		description: description,
		createdBy: {
			username: req.user.username,
			userId: req.user,
		},
		imageIds: imageIds,
		status: 'pending',
	});

	task.save().then((result) => {
		res.redirect('/tasks');
	});
}

async function postAssignTask(req, res, next) {
	const taskId = req.body.id;
	const priority = req.body.priority;
	const dueDate = req.body.due;

	const userData = req.body.userInfo.split('+');
	const assignedTo = {
		username: userData[0],
		userId: userData[1],
	};

	try {
		const task = await Task.findById(taskId);

		task.priority = priority;
		task.assignedTo = assignedTo;
		task.status = 'active';
		task.dueDate = new Date(dueDate).toISOString();

		await task.save();

		res.redirect('/admin');
	} catch (e) {
		console.log(e);
	}
}

async function getUserEditTask(req, res, next) {
	const taskId = req.params.id;

	let foundTask = {};
	try {
		const task = await Task.findById(taskId);
		const formattedDate = formatDate(task.createdAt);

		foundTask = {
			...task,
			createdAt: formattedDate,
		};

		res.render('tasks/edit-task', {
			task: foundTask,
			user: req.user,
			errorMessage: null,
			validationErrors: [],
			activePage: '/tasks',
		});
	} catch (e) {
		console.log(e);
	}
}

async function postUserEditTask(req, res, next) {
	const taskId = req.body.id;
	const updatedTitle = req.body.title;
	const updatedDescription = req.body.description;
	const errors = validationResult(req);

	try {
		const task = await Task.findById(taskId);

		if (!errors.isEmpty()) {
			return res.status(422).render('tasks/edit-task', {
				pageTitle: 'Edit Task',
				task: {
					_doc: {
						title: updatedTitle,
						description: updatedDescription,
						status: 'edited',
						createdBy: task.createdBy,
						_id: task._id,
					},
				},
				user: req.user,
				taskId: taskId,
				errorMessage: errors.array()[0].msg,
				validationErrors: errors.array(),
			});
		}

		task.title = updatedTitle;
		task.description = updatedDescription;

		await task.save();

		res.redirect('/tasks');
	} catch (e) {
		console.log(e);
	}
}

// TODO: Update to delete comments when task is deleted.
async function postDeleteTask(req, res, next) {
	const taskId = req.body.id;

	try {
		const task = await Task.findById(taskId);
		for (let imageId of task.imageIds) {
			const foundImage = await Image.findById(imageId);
			await Image.deleteOne({ _id: foundImage._id });
			fs.unlink(foundImage.path, (err) => {
				if (err) throw err;
				console.log('File Deleted');
			});
		}
		await Comment.deleteMany({ taskId: taskId });
		await Task.deleteOne({ _id: taskId });

		res.redirect('/tasks');
	} catch (e) {
		console.log(e);
	}
}

async function postCompleteTask(req, res, next) {
	const taskId = req.body.id;
	const task = await Task.findById(taskId);

	task.status = 'completed';

	await task.save();

	res.redirect('/admin');
}

async function postTaskForReview(req, res, next) {
	const taskId = req.body.id;
	const task = await Task.findById(taskId);

	task.status = 'reviewing';

	await task.save();

	res.redirect('/tasks');
}

//TODO: Add ability to delete images
async function postDeleteImage(req, res, next) {
	const imageId = req.body.imageId;
	const taskId = req.body.id;

	const task = await Task.findById(taskId);

	let updatedImages = task.imageIds.filter((id) => {
		return id.toString() !== imageId;
	});

	console.log(updatedImages);

	task.imageIds = updatedImages;

	await task.save();

	const image = await Image.findById(imageId);
	console.log(image);

	fs.unlink(image.path, (err) => {
		if (err) throw err;
		console.log('File Deleted');
	});

	Image.deleteOne({ _id: imageId })
		.then(() => {
			res.redirect('/task/' + taskId);
		})
		.catch((err) => console.error(err));
}

module.exports = {
	getIndex,
	getTasks,
	getPendingTasks,
	getActiveTasks,
	postActiveTask,
	getOnHoldTasks,
	postHoldTask,
	getInReviewTasks,
	getCompletedTasks,
	getTask,
	getCreateTask,
	postCreateTask,
	postAssignTask,
	getUserEditTask,
	postUserEditTask,
	postDeleteTask,
	postCompleteTask,
	postTaskForReview,
	postDeleteImage,
};
