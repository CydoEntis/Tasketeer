function getIndex(req, res, next) {
  if(req.session.isLoggedIn) {
		return res.redirect("/dashboard");
	}
  
  res.render("home/index");
}

module.exports = {
  getIndex
}