const express = require('express');
const { body } = require('express-validator');

const taskController = require('../controllers/task/task.controller');
const { isAuth } = require('../middleware/auth.middleware');

const taskRoutes = express.Router();

taskRoutes.use(isAuth);

taskRoutes.get('/tasks', taskController.getIndex);
taskRoutes.get('/tasks/all', taskController.getTasks);
taskRoutes.get('/tasks/pending', taskController.getPendingTasks);
taskRoutes.get('/tasks/active', taskController.getActiveTasks);
taskRoutes.get('/tasks/on-hold', taskController.getOnHoldTasks);
taskRoutes.get('/tasks/in-review', taskController.getInReviewTasks);
taskRoutes.get('/tasks/completed', taskController.getCompletedTasks);
taskRoutes.get('/tasks/high', taskController.getHighTasks);
taskRoutes.get('/tasks/medium', taskController.getMediumTasks);
taskRoutes.get('/tasks/low', taskController.getLowTasks);
taskRoutes.get('/tasks/overdue', taskController.getOverdueTasks);

taskRoutes.get('/tasks/create-task', taskController.getCreateTask);
taskRoutes.post(
	'/tasks/create-task',
	[
		body('title', "Title must be 3 or more characters").isString().isLength({ min: 3 }).trim(),
		body('description', "Description must be 5 or more characters").isString().isLength({ min: 5, max: 200 }).trim(),
	],
	taskController.postCreateTask
);

taskRoutes.post('/assign-task', 
[
	body('dueDate', "A Due date must be selected").notEmpty().isDate()
],
taskController.postAssignTask);
taskRoutes.post('/task/set-active', taskController.postActiveTask);

taskRoutes.post('/task/submit-for-review', taskController.postTaskForReview);

// taskRoutes.post('/task/set-on-hold', taskController.postHoldTask);

taskRoutes.post('/task/complete-task', taskController.postCompleteTask);

taskRoutes.get('/task/:id', taskController.getTask);

taskRoutes.get(
	'/edit-task/:id',
	taskController.getUserEditTask
);

taskRoutes.post('/edit-task', 
[
	body('title', "Please enter a title").isString().isLength({ min: 3 }).trim(),
	body('description', "Please enter a description").isString().isLength({ min: 5, max: 200 }).trim(),
	// body('priority').not().isEmpty(),
	// body('userInfo').not().isEmpty()
],
taskController.postUserEditTask);

taskRoutes.post('/task/delete-task', taskController.postDeleteTask);

taskRoutes.post("/delete-image", taskController.postDeleteImage);



module.exports = taskRoutes;
