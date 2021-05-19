const User = require("../models/user");
const bcrypt = require("bcrypt");
const passwordGenerator = require("generate-password");

const saltRounds = 10;

// add a user
exports.addUser = (req, res) => {
  // generate a temporary token
  const temporaryToken = passwordGenerator.generate({
    length: 10,
    numbers: true,
  });

  // set up a new user
  const user = new User({
    first_name: req.body.firstName,
    surname: req.body.surname,
    username: req.body.email,
    token: temporaryToken,
    role: req.body.userRole,
    nursery_id: req.body.nurseryId,
  });

  // call create model
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "An error occurred while adding the user.",
      });
    else res.send(data);
  });
};

// new user sets password
exports.register = async (req, res) => {
  // encrypt the user's chosen password
  const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);

  // call register model
  User.register(req.params.userId, encryptedPassword, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with user ID ${req.params.userId}`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving user with user ID ${req.params.userId}`,
        });
      }
    } else res.send(data);
  });
};

// update existing user
exports.update = (req, res) => {
  // create user
  const user = new User({
    first_name: req.body.firstName,
    surname: req.body.surname,
  });

  // call model
  User.update(req.params.userId, user, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No user found with ID ${req.params.userId}`,
        });
      } else {
        res.status(500).send({
          message: `Error updating user with ID ${req.params.userId}`,
        });
      }
    } else res.send(data);
  });
};

// find staff for specified nursery
exports.findStaffByNurseryId = (req, res) => {
  User.findStaffByNurseryId(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with nursery ID ${req.params.nurseryId}`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving staff with nursery ID ${req.params.nurseryId}`,
        });
      }
    } else res.send(data);
  });
};

// find carers for specified nursery
exports.findCarersByNurseryId = (req, res) => {
  User.findCarersByNurseryId(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with nursery ID ${req.params.nurseryId}`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving carers with nursery ID ${req.params.nurseryId}`,
        });
      }
    } else res.send(data);
  });
};

// find user to match unique token in link
exports.findUserByToken = (req, res) => {
  User.findUserByToken(req.params.token, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with token ${req.params.token}`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving users with token ${req.params.token}`,
        });
      }
    } else res.send(data);
  });
};

// find children for a specific carer
exports.findChildren = (req, res) => {
  User.findChildren(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with user ID ${req.params.userId}`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving children with user ID ${req.params.userId}`,
        });
      }
    } else res.send(data);
  });
};

// delete user - set timestamp
exports.delete = (req, res) => {
  User.delete(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `User not found with ID ${req.params.userId}`,
        });
      } else {
        res.status(500).send({
          message: `Could not delete user with ID ${req.params.userId}`,
        });
      }
    } else res.send({ message: "User was deleted successfully!" });
  });
};
