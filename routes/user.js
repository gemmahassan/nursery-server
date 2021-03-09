module.exports = app => {
  const user = require('../controllers/user');

  app.post("/user/token", user.token);
  app.post("/user/login", user.login);
  app.post("/user/logout", user.logout);
};
