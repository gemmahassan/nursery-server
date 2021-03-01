const User = require('../models/user');
const jwt = require("jsonwebtoken");
const { secret } = require("../config/auth");

exports.addUser = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Journal Entry
  const entry = new User({
    username: req.body.username,
    password: req.body.password,
  });

  // Save Journal in the database
  User.create(entry, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while adding the user."
      });
    else res.send(data);
  });
};

exports.login = (req, res) => {
  // Read username and password from request body
  const {username, password} = req.body;

  // Filter user from the users array by username and password
  const user = User.findByUsernameAndPassword(password, username, (err, user) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while adding the entry."
      });
    else {
      if (user) {
        // Generate an access token
        const accessToken = jwt.sign({username: user.username, role: user.role}, secret);

        res.send({accessToken});
      } else {
        res.send('Username or password incorrect');
      }
    }
  });
}