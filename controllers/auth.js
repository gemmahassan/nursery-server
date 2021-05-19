const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { refreshTokenSecret, secret } = require("../config/auth");
let { refreshTokens } = require("../config/auth");

// add a new user via nursery signup
exports.signup = (req, res) => {
  // create new User
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

        // TO DO: refresh token functionality not fully implemented
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
  // extract the token from the request
  const { token } = req.body;

  // if no token, unauthorised
  if (!token) {
    return res.sendStatus(401);
  }

  // not fully implemented
  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  // verify token - sign with username and role
  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      accessTokenSecret,
      { expiresIn: "60m" }
    );

    // return the token
    res.json({
      accessToken,
    });
  });
};
