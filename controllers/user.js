const User = require('../models/user');
const bcrypt = require('bcrypt');
const passwordGenerator = require('generate-password');
const fs = require("fs");

const saltRounds = 10;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content");
};

exports.adminDashBoard = (req, res) => {
  res.status(200).send("Admin Dashboard");
};

exports.staffDashBoard = (req, res) => {
  res.status(200).send("Staff Dashboard");
};

exports.carerDashBoard = (req, res) => {
  res.status(200).send("Carer Dashboard");
};

exports.addUser = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // generate a temporary token
  const temporaryToken = passwordGenerator.generate({
    length: 10,
    numbers: true,
  });

  let image;
  if (req.file) {
    image = fs.readFileSync(req.file.path);
  }

  const user = new User({
      first_name: req.body.first_name,
      surname: req.body.surname,
      username: req.body.email,
      token: temporaryToken,
      role: req.body.role,
      nursery_id: req.body.nursery_id,
      image: image,
    }
  );

  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while adding the user."
      });
    else res.send(data);
  });
};

exports.register = async (req, res) => {
  const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);

  User.register(req.params.userId, encryptedPassword, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found with user ID ${req.params.userId}`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving user with user ID ${req.params.userId}`
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log("update: ", req.body);


  const user = new User({
    first_name: req.body.firstName,
    surname: req.body.surname,
  });

  User.update(req.params.userId, user,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No user found with ID ${req.params.userId}`
          });
        } else {
          res.status(500).send({
            message: `Error updating user with ID ${req.params.userId}`
          })
        }
      } else res.send(data);
    }
  );
};

exports.findStaffByNurseryId = (req, res) => {
  User.findStaffByNurseryId(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found with nursery ID ${req.params.nurseryId}`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving staff with nursery ID ${req.params.nurseryId}`
        });
      }
    } else res.send(data);
  });
};

exports.findCarersByNurseryId = (req, res) => {
  User.findCarersByNurseryId(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found with nursery ID ${req.params.nurseryId}`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving carers with nursery ID ${req.params.nurseryId}`
        });
      }
    } else res.send(data);
  });
};

exports.findUserByToken = (req, res) => {
  User.findUserByToken(req.params.token, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found with token ${req.params.token}`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving users with token ${req.params.token}`
        });
      }
    } else res.send(data);
  });
};

exports.findChildren = (req, res) => {
  console.log("controller");
  User.findChildren(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found with user ID ${req.params.userId}`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving children with user ID ${req.params.userId}`
        });
      }
    } else res.send(data);
  });
};

exports.delete = (req, res) => {
  User.delete(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `User not found with ID ${req.params.userId}`
        });
      } else {
        res.status(500).send({
          message: `Could not delete user with ID ${req.params.userId}`
        });
      }
    } else res.send({message: "User was deleted successfully!"});
  });
};
