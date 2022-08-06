require('dotenv').config();
const express = require('express');
const path = require('path');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const multer = require('multer');
const csurf = require('csurf');
const flash = require('connect-flash');

const User = require('./models/user/user.model');
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const taskRoutes = require('./routes/task.routes');
const homeRoutes = require('./routes/home.routes');
const adminRoutes = require('./routes/admin.routes');
const commentRoutes = require('./routes/comment.routes');
const projectRoutes = require('./routes/project.routes');

const MONGODB_URI = process.env.APP_URI;
	

const app = express();

const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions',
});

const csrfProtection = csurf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	multer({
		storage: fileStorage,
		fileFilter: fileFilter,
	}).array('images')
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
	session({
		secret: 'sesh',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.isAdmin = req.session.isAdmin;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}

	User.findById(req.session.user._id)
		.then((user) => {
			if (!user) {
				return next();
			}

			req.user = user;
			next();
		})
		.catch((err) => {
			console.log(err);
		});
});

app.use(authRoutes);
app.use(homeRoutes);
app.use(dashboardRoutes);
app.use(taskRoutes);
app.use(commentRoutes);
app.use(projectRoutes);
app.use(adminRoutes);

mongoose
	.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(3000);
	})
	.catch((err) => console.log(err));
