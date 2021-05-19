const { verifySignUp } = require("../middleware");
const auth = require("../controllers/auth");

module.exports = (app) => {
  app.post("/user/signup", verifySignUp.checkDuplicateUsername, auth.signup);
  app.post("/user/login", auth.login);
};
