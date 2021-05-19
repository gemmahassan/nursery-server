const User = require("../models/user");

// check if username is already in use, if so send 400 error where frontend will notify user
checkDuplicateUsername = (req, res, next) => {
  User.findByUsername(req.body.email, (err, user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!",
      });
      return;
    }
    next();
  });
};

const verifySignUp = {
  checkDuplicateUsername: checkDuplicateUsername,
};

module.exports = verifySignUp;
