module.exports = app => {
  const user = require('../controllers/user');

  app.post("/user/login", user.login);
};