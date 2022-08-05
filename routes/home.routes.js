const express = require("express");

const homeController = require("../controllers/home/home.controller");
const { isAuth } = require("../middleware/auth.middleware");

const homeRoutes = express.Router();

homeRoutes.get("/", isAuth, homeController.getIndex);


module.exports = homeRoutes;