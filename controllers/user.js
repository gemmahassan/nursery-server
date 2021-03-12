const User = require('../models/user');

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

  // Create a Journal Entry
  const entry = new User({
    first_name: req.body.first_name,
    surname: req.body.surname,
    username: req.body.username,
    password: req.body.password,
    nursery_id: req.body.nursery_id,
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
