const ObjectId = require('mongodb').ObjectId;

const Task = require('../../models/task/task.model');
const { formatDate } = require('../../utils/util');

const TASKS_PER_PAGE = 2;

async function getDashboard(req, res, next) {
	const user = req.user;
	let pendingTasks = 0;
	let activeTasks = 0;
	let onHoldTasks = 0;
	let inReviewTasks = 0;
	let completedTasks = 0;
	let overdueTasks = 0;

	const tasks = await Task.find({ assingedTo: req.user._id });

	for (let task of tasks) {
		if (task.status === 'active') {
			activeTasks += 1;
		} else if (task.status === 'hold') {
			onHoldTasks += 1;
		} else if (task.status === 'complete') {
			completedTasks += 1;
		} else if (task.status === 'pending') {
			pendingTasks += 1;
		} else if (task.status === 'reviewing') {
			inReviewTasks += 1;
		} else if (task.status === 'overdue') {
			overdueTasks += 1;
		}
	}

	res.render('dashboard/dashboard', {
		tasks: tasks,
		user: user,
		activeTasks: activeTasks,
		onHoldTasks: onHoldTasks,
		completedTasks: completedTasks,
		pendingTasks: pendingTasks,
		inReviewTasks: inReviewTasks,
		overdueTasks: overdueTasks,
		activePage: '/dashboard',
	});
}

async function getWeeklyTasks(req, res, next) {
	const today = new Date();
	let day = today.getDate();
	const year = today.getFullYear();
	let month = today.getMonth() + 1;

	const lastDayPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
	const currentISODate = new Date(`${year}-${month}-${day}`).toISOString();
	let lastWeeksISODate;
	if (day === 1) {
		day = lastDayPrevMonth.getDate();
		month -= 1;
		lastWeeksISODate = new Date(
			`${year}-${month}-${day - 6}`
		).toISOString();
	}

	const pastWeeksTasks = await Task.find({
		assingedTo: req.user._id,
		createdAt: { $gte: lastWeeksISODate, $lte: currentISODate },
	});

	const weeklyTasks = {};
	for (let i = 5; i >= 0; i--) {
		if (day <= 1) {
			day = lastDayPrevMonth.getDate();
			month -= 1;
		}
		currDay = day - i;
		weeklyTasks[month + '/' + currDay + '/' + year] = 0;
	}

	weeklyTasks[month + 1 + '/' + today.getDate() + '/' + year] = 0;

	for (let task of pastWeeksTasks) {
		let taskDate = new Date(task.createdAt);
		let taskDateDay = taskDate.getDate();
		let taskDateMonth = taskDate.getMonth();
		let taskDateYear = taskDate.getFullYear();
		let formattedDate =
			taskDateMonth + '/' + taskDateDay + '/' + taskDateYear;
		for (let date in weeklyTasks) {
			if (formattedDate === date) {
				weeklyTasks[day] += 1;
			}
		}
	}
	res.json(weeklyTasks);
}

async function getAllTasks(req, res, next) {
	try {
		const tasks = await Task.find({
			'createdBy.userId': ObjectId(req.user._id),
		});

		res.json(tasks);
	} catch (e) {
		console.log(e);
	}
}

async function getTasks(req, res, next) {
	const page = +req.query.page || 1;

	const formattedTasks = [];
	let pendingTasks = 0;
	let activeTasks = 0;
	let holdTasks = 0;
	let reviewingTasks = 0;
	let completedTasks = 0;

	try {
		const numTasks = await Task.find({
			status: { $ne: 'pending' },
		}).countDocuments();

		const tasks = await Task.find({ status: { $ne: 'pending' } })
			.sort({
				createdAt: -1,
			})
			.limit(30);

		for (let task of tasks) {
			const formattedDate = formatDate(task.createdAt);
			let formattedDesc = task.description.substring(0, 50);
			if (formattedDesc.length >= 50) {
				formattedDesc += '...';
			}

			if (task.status === 'active') {
				activeTasks += 1;
			} else if (task.status === 'hold') {
				holdTasks += 1;
			} else if (task.status === 'complete') {
				completedTasks += 1;
			} else if (task.status === 'pending') {
				pendingTasks += 1;
			} else if (task.status === 'reviewing') {
				reviewingTasks += 1;
			}

			const formattedTask = {
				...task,
				createdAt: formattedDate,
				description: formattedDesc,
			};
			formattedTasks.push(formattedTask);
		}

		res.render('tasks/tasks', {
			tasks: formattedTasks,
			title: 'All Tasks',
			userId: req.user._id,
			activeTasks: activeTasks,
			holdTasks: holdTasks,
			completedTasks: completedTasks,
			pendingTasks: pendingTasks,
			reviewingTasks: reviewingTasks,
			activePage: '/dashboard',
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
			status: 'pending',
			'createdBy.userId': ObjectId(req.user._id),
		}).countDocuments();

		const tasks = await Task.find({
			status: 'pending',
			'createdBy.userId': ObjectId(req.user._id),
		})
			.sort({
				createdAt: -1,
			})
			.skip((page - 1) * TASKS_PER_PAGE)
			.limit(TASKS_PER_PAGE);



		for (let task of tasks) {
			const formattedDate = formatDate(task.createdAt);
			let formattedDesc = task.description.substring(0, 50);
			if (formattedDesc.length >= 50) {
				formattedDesc += '...';
			}
			const formattedTask = {
				...task,
				createdAt: formattedDate,
				description: formattedDesc,
			};
			formattedTasks.push(formattedTask);
		}
	
		res.render('tasks/tasks-view', {
			tasks: formattedTasks,
			title: 'Pending',
			userId: req.user._id,
			activePage: '/dashboard',
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
			let formattedDesc = task.description.substring(0, 50);
			if (formattedDesc.length >= 50) {
				formattedDesc += '...';
			}
			const formattedTask = {
				...task,
				createdAt: formattedDate,
				description: formattedDesc,
			};
			formattedTasks.push(formattedTask);
		}
		res.render('tasks/tasks-view', {
			tasks: formattedTasks,
			title: 'Active',
			userId: req.user._id,
			activePage: '/dashboard',
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

async function getHoldTasks(req, res, next) {
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
			let formattedDesc = task.description.substring(0, 50);
			if (formattedDesc.length >= 50) {
				formattedDesc += '...';
			}
			const formattedTask = {
				...task,
				createdAt: formattedDate,
				description: formattedDesc,
			};
			formattedTasks.push(formattedTask);
		}
		res.render('tasks/tasks-view', {
			tasks: formattedTasks,
			title: 'On Hold',
			userId: req.user._id,
			activePage: '/dashboard',
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
			let formattedDesc = task.description.substring(0, 50);
			if (formattedDesc.length >= 50) {
				formattedDesc += '...';
			}
			const formattedTask = {
				...task,
				createdAt: formattedDate,
				description: formattedDesc,
			};
			formattedTasks.push(formattedTask);
		}
		res.render('tasks/tasks-view', {
			tasks: formattedTasks,
			title: 'Completed',
			userId: req.user._id,
			activePage: '/dashboard',
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

async function getReviewingTasks(req, res, next) {
	const page = +req.query.page || 1;

	const formattedTasks = [];
	try {
		const numTasks = await Task.find({
			status: 'reviewing',
			'assignedTo.userId': ObjectId(req.user._id),
		}).countDocuments();

		const tasks = await Task.find({
			status: 'reviewing',
			'assignedTo.userId': ObjectId(req.user._id),
		})
			.sort({
				createdAt: -1,
			})
			.skip((page - 1) * TASKS_PER_PAGE)
			.limit(TASKS_PER_PAGE);



		for (let task of tasks) {
			const formattedDate = formatDate(task.createdAt);
			let formattedDesc = task.description.substring(0, 50);
			if (formattedDesc.length >= 50) {
				formattedDesc += '...';
			}
			const formattedTask = {
				...task,
				createdAt: formattedDate,
				description: formattedDesc,
			};
			formattedTasks.push(formattedTask);
		}
		res.render('tasks/tasks-view', {
			tasks: formattedTasks,
			title: 'In Review',
			userId: req.user._id,
			activePage: '/dashboard',
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

module.exports = {
	getDashboard,
	getWeeklyTasks,
	getAllTasks,
	getTasks,
	getPendingTasks,
	getActiveTasks,
	getHoldTasks,
	getCompletedTasks,
	getReviewingTasks,
};
