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

exports.addUser = async (req, res) => {
  console.log("BODY: ", req.body);
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // generate a temporary password
  const temporaryPassword = passwordGenerator.generate({
    length: 10,
    numbers: true,
  });

  // hash the temporary password before storing it in the database
  const encryptedTemporaryPassword = await bcrypt.hash(temporaryPassword, saltRounds);

  const image = fs.readFileSync(req.file.path);
  const user = new User({
      first_name: req.body.first_name,
      surname: req.body.surname,
      username: req.body.email,
      password: encryptedTemporaryPassword,
      role: req.body.role,
      nursery_id: req.body.nursery_id,
      image: image,
    }
  );

  console.log(user);

  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while adding the user."
      });
    else res.send(data);
  });
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
          message: `Error retrieving Staff with nursery ID ${req.params.nurseryId}`
        });
      }
    } else res.send(data);
  });
};

