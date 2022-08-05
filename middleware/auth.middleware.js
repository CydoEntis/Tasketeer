function isAuth(req, res, next) {
  if(!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
}

function isAdmin(req, res, next) {
  if(!req.session.isAdmin) {
    return res.redirect("/dashboard");
  } 
  next();
}

module.exports = {
  isAuth,
  isAdmin,
}