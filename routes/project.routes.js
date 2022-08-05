const express = require("express");

const projectController = require("../controllers/project/project.controller");
const { isAuth } = require("../middleware/auth.middleware");

const projectRoutes = express.Router();

projectRoutes.get("/dashboard/projects", isAuth, projectController.getProjects);


module.exports = projectRoutes;