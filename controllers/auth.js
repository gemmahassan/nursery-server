const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { refreshTokenSecret, secret } = require("../config/auth");
let { refreshTokens } = require("../config/auth");

exports.signup = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const user = new User({
    username: req.body.email,
    password: req.body.password,
  });

  // Save user in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "An error occurred while adding the user.",
      });
    else res.send(data);
  });
};

exports.login = (req, res) => {
  // Read username and password from request body
  const { username, password } = req.body;

  // returns user details matching username and password
  User.login(password, username, (err, user) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while logging in.",
      });
    } else {
      if (user) {
        // Generate an access token
        const accessToken = jwt.sign(
          {
            userId: user.id,
            username: user.username,
            role: user.role,
            nurseryId: user.nursery_id,
            activated: user.activated,
            firstName: user.first_name,
            surname: user.surname,
          },
          secret,
          { expiresIn: "60m" }
        );

        const refreshToken = jwt.sign(
          {
            username: user.username,
            role: user.role,
          },
          refreshTokenSecret
        );

        refreshTokens.push(refreshToken);

        // return the access token to the frontend along with necessary user data
        res.json({
          accessToken,
          username,
          refreshToken,
          activated: user.activated,
          userId: user.id,
          role: user.role,
          nurseryId: user.nursery_id,
          firstName: user.first_name,
          surname: user.surname,
        });
      } else {
        res.status(401).send({
          message: "Login failed.",
        });
      }
    }
  });
};

exports.token = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      accessTokenSecret,
      { expiresIn: "20m" }
    );

    res.json({
      accessToken,
    });
  });
};
