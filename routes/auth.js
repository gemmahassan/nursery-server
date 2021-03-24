const { verifySignUp } = require("../middleware");
const auth = require('../controllers/auth');

module.exports = app => {
  app.post("/user/token", auth.token);
  app.post("/user/signup", verifySignUp.checkDuplicateUsername, auth.signup);
  app.post("/user/login", auth.login);
  app.post("/user/logout", auth.logout);
};
