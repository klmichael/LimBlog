module.exports = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/') //if user already logged in, go home
  }
  next();
};