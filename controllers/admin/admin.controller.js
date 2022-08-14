const Task = require('../../models/task/task.model');
const User = require('../../models/user/user.model');
const Image = require('../../models/image/image.model');
const io = require('../../socket');

const { formatDate } = require('../../utils/util');

const TASKS_PER_PAGE = 15;

async function getAdminPanel(req, res, next) {
	const page = +req.query.page || 1;
	const formattedTasks = [];

	const numTasks = await Task.find().countDocuments();

	const tasks = await Task.find()
		.sort({ createdAt: -1 })
		.skip((page - 1) * TASKS_PER_PAGE)
		.limit(TASKS_PER_PAGE);

	for (let task of tasks) {
		const formattedDate = formatDate(task.createdAt);
		const formattedTask = {
			...task,
			createdAt: formattedDate,
		};
		formattedTasks.push(formattedTask);
	}


	res.render('admin/admin-panel', {
		tasks: formattedTasks,
		title: 'Admin Panel',
		activePage: '/admin',
		activeBtn: 'all',
		currentPage: page,
		hasNextPage: TASKS_PER_PAGE * page < numTasks,
		hasPrevPage: page > 1,
		nextPage: page + 1,
		prevPage: page - 1,
		lastPage: Math.ceil(numTasks / TASKS_PER_PAGE),
	});
}

async function getPendingTasks(req, res, next) {
	const page = +req.query.page || 1;

	const numTasks = await Task.find({
		status: { $ne: 'pending' },
	}).countDocuments();

	const formattedTasks = [];

	const tasks = await Task.find({ status: 'pending' })
		.sort({
			createdAt: -1,
		})
		.skip((page - 1) * TASKS_PER_PAGE)
		.limit(TASKS_PER_PAGE);

	for (let task of tasks) {
		const formattedDate = formatDate(task.createdAt);

		const formattedTask = {
			...task,
			createdAt: formattedDate,
		};
		formattedTasks.push(formattedTask);
	}

	res.render('admin/admin-panel', {
		tasks: formattedTasks,
		title: 'Pending',
		activePage: '/admin',
		activeBtn: 'pending',
		currentPage: page,
		hasNextPage: TASKS_PER_PAGE * page < numTasks,
		hasPrevPage: page > 1,
		nextPage: page + 1,
		prevPage: page - 1,
		lastPage: Math.ceil(numTasks / TASKS_PER_PAGE),
	});
}

async function getActiveTasks(req, res, next) {
	const page = +req.query.page || 1;

	const numTasks = await Task.find({
		status: 'active',
	}).countDocuments();

	const formattedTasks = [];
	const tasks = await Task.find({ status: 'active' })
		.sort({ createdAt: -1 })
		.skip((page - 1) * TASKS_PER_PAGE)
		.limit(TASKS_PER_PAGE);

	for (let task of tasks) {
		const formattedDate = formatDate(task.createdAt);

		const formattedTask = {
			...task,
			createdAt: formattedDate,
		};
		formattedTasks.push(formattedTask);
	}

	res.render('admin/admin-panel', {
		tasks: formattedTasks,
		title: 'Active',
		activePage: '/admin',
		activeBtn: 'active',
		currentPage: page,
		hasNextPage: TASKS_PER_PAGE * page < numTasks,
		hasPrevPage: page > 1,
		nextPage: page + 1,
		prevPage: page - 1,
		lastPage: Math.ceil(numTasks / TASKS_PER_PAGE),
	});
}

async function getHoldTasks(req, res, next) {
	const page = +req.query.page || 1;

	const numTasks = await Task.find({
		status: 'hold',
	}).countDocuments();

	const formattedTasks = [];
	const tasks = await Task.find({ status: 'hold' })
		.sort({ createdAt: -1 })
		.skip((page - 1) * TASKS_PER_PAGE)
		.limit(TASKS_PER_PAGE);
	for (let task of tasks) {
		const formattedDate = formatDate(task.createdAt);

		const formattedTask = {
			...task,
			createdAt: formattedDate,
		};
		formattedTasks.push(formattedTask);
	}

	res.render('admin/admin-panel', {
		tasks: formattedTasks,
		title: 'Hold',
		activePage: '/admin',
		activeBtn: 'hold',
		currentPage: page,
		hasNextPage: TASKS_PER_PAGE * page < numTasks,
		hasPrevPage: page > 1,
		nextPage: page + 1,
		prevPage: page - 1,
		lastPage: Math.ceil(numTasks / TASKS_PER_PAGE),
	});
}

async function getReviewingTasks(req, res, next) {
	const page = +req.query.page || 1;

	const numTasks = await Task.find({
		status: 'reviewing',
	}).countDocuments();

	const formattedTasks = [];
	const tasks = await Task.find({ status: 'reviewing' })
		.sort({
			createdAt: -1,
		})
		.skip((page - 1) * TASKS_PER_PAGE)
		.limit(TASKS_PER_PAGE);
	for (let task of tasks) {
		const formattedDate = formatDate(task.createdAt);

		const formattedTask = {
			...task,
			createdAt: formattedDate,
		};
		formattedTasks.push(formattedTask);
	}

	res.render('admin/admin-panel', {
		tasks: formattedTasks,
		title: 'Review',
		activePage: '/admin',
		activeBtn: 'reviewing',
		currentPage: page,
		hasNextPage: TASKS_PER_PAGE * page < numTasks,
		hasPrevPage: page > 1,
		nextPage: page + 1,
		prevPage: page - 1,
		lastPage: Math.ceil(numTasks / TASKS_PER_PAGE),
	});
}

async function getCompletedTasks(req, res, next) {
	const page = +req.query.page || 1;

	const numTasks = await Task.find({
		status: 'complete',
	}).countDocuments();

	const formattedTasks = [];
	const tasks = await Task.find({ status: 'complete' })
		.sort({
			createdAt: -1,
		})
		.skip((page - 1) * TASKS_PER_PAGE)
		.limit(TASKS_PER_PAGE);
	for (let task of tasks) {
		const formattedDate = formatDate(task.createdAt);

		const formattedTask = {
			...task,
			createdAt: formattedDate,
		};
		formattedTasks.push(formattedTask);
	}

	res.render('admin/admin-panel', {
		tasks: formattedTasks,
		title: 'Completed',
		activePage: '/admin',
		activeBtn: 'complete',
		currentPage: page,
		hasNextPage: TASKS_PER_PAGE * page < numTasks,
		hasPrevPage: page > 1,
		nextPage: page + 1,
		prevPage: page - 1,
		lastPage: Math.ceil(numTasks / TASKS_PER_PAGE),
	});
}

async function getAdminEditTask(req, res, next) {
	const taskId = req.params.id;

	let foundTask = {};
	try {
		const task = await Task.findById(taskId);
		const users = await User.find();
		const formattedDate = formatDate(task.createdAt);

		foundTask = {
			...task,
			createdAt: formattedDate,
		};

		const images = [];
		for (let imageId of task.imageIds) {
			const foundImage = await Image.findById(imageId);
			images.push(foundImage);
		}

		res.render('admin/admin-edit', {
			task: foundTask,
			user: req.user,
			users: users,
			images: images,
			errorMessage: null,
			validationErrors: [],
			activePage: '/admin',
		});
	} catch (e) {
		console.log(e);
	}
}

async function postPutOnHoldTask(req, res, next) {
	const taskId = req.body.id;
	const task = await Task.findById(taskId);

	task.status = 'hold';

	io.getIO().emit('tasks', {
		action: 'status',
		task: task,
	});

	await task.save();

	res.redirect('/admin');
}

async function postTakeOffHoldTask(req, res, next) {
	const taskId = req.body.id;
	const task = await Task.findById(taskId);

	task.status = 'active';

	await task.save();

	io.getIO().emit('tasks', {
		action: 'status',
		task: task,
	});

	res.redirect('/admin');
}

async function getUserRoles(req, res, next) {
	try {
		const users = await User.find();

		res.render('admin/roles', {
			users: users,
			title: 'Roles',
			activePage: '/roles',
		});
	} catch (e) {
		console.log(e);
	}
}

async function postUserRoles(req, res, next) {
	try {
		for (let id of req.body.id) {
			const user = await User.findById(id);
			if(req.body.role.includes(id)) {
				user.role = 'admin';
			} else {
				user.role = 'user';
			}
			await user.save();
		}
		
		const users = await User.find();
		res.render('admin/roles', {
			users: users,
			title: 'Roles',
			activePage: '/roles',
		});
	} catch (e) {
		console.log(e);
	}
}

module.exports = {
	getAdminPanel,
	getPendingTasks,
	getActiveTasks,
	getHoldTasks,
	getReviewingTasks,
	getCompletedTasks,
	getAdminEditTask,
	// postAdminEditTask,
	postPutOnHoldTask,
	postTakeOffHoldTask,
	getUserRoles,
	postUserRoles,
};
