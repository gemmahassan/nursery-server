const Staff = require('../models/staff');
const fs = require("fs");

exports.findStaffByNurseryId = (req, res) => {
  Staff.findByNurseryId(req.params.nurseryId, (err, data) => {
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

exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const image = fs.readFileSync(req.file.path);
  const staff = new Staff({
    first_name: req.body.first_name,
    surname: req.body.surname,
    email: req.body.email,
    image: image,
    nursery_id: req.body.nursery_id
  });

  Staff.create(staff,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while adding the staff member."
      });
    else res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Staff.update(req.body.staffId, req.body.userId,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No staff found with ID ${req.body.staffId}`
          });
        } else {
          res.status(500).send({
            message: `Error updating staff with ID ${req.body.staffId}`
          })
        }
      } else res.send(data);
    }
  );
};