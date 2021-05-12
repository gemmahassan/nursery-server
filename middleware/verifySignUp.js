const User = require("../models/user");

checkDuplicateUsername = (req, res, next) => {
  User.findByUsername(req.body.email, (err, user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
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
