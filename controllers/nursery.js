const fs = require("fs");
const Nursery = require('../models/nursery');

exports.getAllConfirmedNurseries = (req, res) => {
  Nursery.getAllConfirmed((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || `Error retrieving nurseries`
      });
    else res.send(data);
  });
};

exports.getAllPendingNurseries = (req, res) => {
  Nursery.getAllPending((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || `Error retrieving nurseries`
      });
    else res.send(data);
  });
};

exports.getAll = (req, res) => {
  Nursery.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || `Error retrieving nurseries`
      });
    else res.send(data);
  });
};

exports.getNurseryById = (req, res) => {
  Nursery.findById(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found with nursery ID ${req.params.nurseryId}`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Nursery with nursery ID ${req.params.nurseryId}`
        });
      }
    } else res.send(data);
  });
};

exports.getAllChildren = (req, res) => {
  Nursery.getAllChildren(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found with nursery ID ${req.params.nurseryId}`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Children with nursery ID ${req.params.nurseryId}`
        });
      }
    } else res.send(data);
  });
};

exports.signup = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const image = fs.readFileSync(req.file.path);

  const nursery = new Nursery({
    name: req.body.name,
    contact_first_name: req.body.contact_first_name,
    contact_surname: req.body.contact_surname,
    email: req.body.email,
    phone: req.body.phone,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    town: req.body.town,
    county: req.body.county,
    postcode: req.body.postcode,
    color: req.body.color,
    image: image,
  });

  Nursery.create(nursery, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while adding the nursery."
      });
    else res.send(data);
  });
};

exports.approve = (req, res) => {
  Nursery.approve(req.params.nurseryId,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No entry found with ID ${req.params.nurseryId}`
          });
        } else {
          res.status(500).send({
            message: `Error updating Nursery with ID ${req.params.nurseryId}`
          })
        }
      } else res.send(data);
    }
  );
};

exports.decline = (req, res) => {
  Nursery.decline(req.params.nurseryId,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No entry found with ID ${req.params.nurseryId}`
          });
        } else {
          res.status(500).send({
            message: `Error deleting Nursery with ID ${req.params.nurseryId}`
          })
        }
      } else res.send(data);
    }
  );
};