const express = require("express");

const dashboardController = require("../controllers/dashboard/dashboard.controller");
const { isAuth } = require("../middleware/auth.middleware");

const dashboardRoutes = express.Router();

dashboardRoutes.use(isAuth);

dashboardRoutes.get("/dashboard", dashboardController.getDashboard);
dashboardRoutes.get("/weeklyTasks", dashboardController.getWeeklyTasks);
dashboardRoutes.get("/getAllTasks", dashboardController.getAllTasks);
dashboardRoutes.get('/dashboard/tasks/all', dashboardController.getTasks);
dashboardRoutes.get('/dashboard/tasks/pending', dashboardController.getPendingTasks);
dashboardRoutes.get('/dashboard/tasks/active', dashboardController.getActiveTasks);
dashboardRoutes.get('/dashboard/tasks/on-hold', dashboardController.getHoldTasks);
dashboardRoutes.get('/dashboard/tasks/completed', dashboardController.getCompletedTasks);
dashboardRoutes.get('/dashboard/tasks/in-review', dashboardController.getReviewingTasks);

module.exports = dashboardRoutes;