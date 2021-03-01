const db = require("../models");
const User = db.user;

checkDuplicateUsername = (req, res, next) => {
  User.findByUsername(req.body.username)
    .then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Username is already in use!"
        });
        return;
      }

      // // Email
      // User.findOne({
      //   where: {
      //     email: req.body.email
      //   }
      // }).then(user => {
      //   if (user) {
      //     res.status(400).send({
      //       message: "Failed! Email is already in use!"
      //     });
      //     return;
      //   }

        next();
      // });
    });
};

const verifySignUp = {
  checkDuplicateUsername: checkDuplicateUsername,
};

module.exports = verifySignUp;