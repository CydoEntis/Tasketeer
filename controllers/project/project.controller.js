async function getProjects(req, res, next) {
	res.render("dashboard/projects", {
		activePage: '/dashboard/projects'
	});
}

module.exports = {
	getProjects,
}