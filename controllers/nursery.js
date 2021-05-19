const fs = require("fs");
const Nursery = require("../models/nursery");

// gets all nurseries confirmed on the system
exports.getAllConfirmedNurseries = (req, res) => {
  Nursery.getAllConfirmed((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || `Error retrieving nurseries`,
      });
    else res.send(data);
  });
};

// gets all nurseries not confirmed on the system
exports.getAllPendingNurseries = (req, res) => {
  Nursery.getAllPending((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || `Error retrieving nurseries`,
      });
    else res.send(data);
  });
};

// find specific nursery by nurseryId
exports.getNurseryById = (req, res) => {
  Nursery.findById(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with nursery ID ${req.params.nurseryId}`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Nursery with nursery ID ${req.params.nurseryId}`,
        });
      }
    } else res.send(data);
  });
};

// get all children for specified nursery
exports.getAllChildren = (req, res) => {
  Nursery.getAllChildren(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with nursery ID ${req.params.nurseryId}`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Children with nursery ID ${req.params.nurseryId}`,
        });
      }
    } else res.send(data);
  });
};

// add nursery (via contact form)
exports.signup = (req, res) => {
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
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  });

  // call model
  Nursery.create(nursery, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "An error occurred while adding the nursery.",
      });
    else res.send(data);
  });
};

// approve nursery application from superadmin dashboard
exports.approve = (req, res) => {
  Nursery.approve(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No entry found with ID ${req.params.nurseryId}`,
        });
      } else {
        res.status(500).send({
          message: `Error updating Nursery with ID ${req.params.nurseryId}`,
        });
      }
    } else res.send(data);
  });
};

// decline nursery application from superadmin dashboard
exports.decline = (req, res) => {
  Nursery.decline(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No entry found with ID ${req.params.nurseryId}`,
        });
      } else {
        res.status(500).send({
          message: `Error deleting Nursery with ID ${req.params.nurseryId}`,
        });
      }
    } else res.send(data);
  });
};

// purge all deleted data
exports.purge = (req, res) => {
  Nursery.purge(req, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No entries to delete`,
        });
      } else {
        res.status(500).send({
          message: `Error deleting Nursery with ID ${req.params.nurseryId}`,
        });
      }
    } else res.send(data);
  });
};

// deactivate a nursery account
exports.deactivate = (req, res) => {
  Nursery.deactivate(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No entry found with ID ${req.params.nurseryId}`,
        });
      } else {
        res.status(500).send({
          message: `Error deleting Nursery with ID ${req.params.nurseryId}`,
        });
      }
    } else res.send(data);
  });
};
