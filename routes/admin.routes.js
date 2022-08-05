const express = require('express');

const adminController = require('../controllers/admin/admin.controller');
const { isAuth, isAdmin } = require('../middleware/auth.middleware');

const adminRoutes = express.Router();



adminRoutes.use(isAdmin);
adminRoutes.use(isAuth);

adminRoutes.get('/admin', adminController.getAdminPanel);
adminRoutes.get('/admin/pending-tasks', adminController.getPendingTasks);
adminRoutes.get('/admin/active-tasks', adminController.getActiveTasks);
adminRoutes.get('/admin/hold-tasks', adminController.getHoldTasks);
adminRoutes.get('/admin/review-tasks', adminController.getReviewingTasks);
adminRoutes.get('/admin/completed-tasks', adminController.getCompletedTasks);
adminRoutes.get('/admin/admin-edit/:id', adminController.getAdminEditTask);
adminRoutes.post('/put-on-hold', adminController.postPutOnHoldTask);
adminRoutes.post('/take-off-hold', adminController.postTakeOffHoldTask);
adminRoutes.get('/roles', adminController.getUserRoles);
adminRoutes.post('/set-roles', adminController.postUserRoles);

module.exports = adminRoutes;
