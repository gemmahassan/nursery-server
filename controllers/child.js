const fs = require("fs");
const Child = require("../models/child");

// add a new child
exports.createChild = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // check if an image was passed across
  let image;
  if (req.file) {
    image = fs.readFileSync(req.file.path);
  }

  // create new Child with data from request
  const child = new Child({
    first_name: req.body.first_name,
    surname: req.body.surname,
    image: image,
    nursery_id: req.body.nursery_id,
    photo_permission: req.body.permission,
  });

  // call model
  Child.create(child, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "An error occurred while adding the child.",
      });
    else res.send(data);
  });
};

// update existing child
exports.update = (req, res) => {
  // check if an image was uploaded
  let image;
  if (req.file) {
    image = fs.readFileSync(req.file.path);
  }

  // create new child
  const child = new Child({
    first_name: req.body.first_name,
    surname: req.body.surname,
    image: image,
    photo_permission: req.body.permission,
  });

  // call model
  Child.update(req.params.childId, child, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No child found with ID ${req.params.childId}`,
        });
      } else {
        res.status(500).send({
          message: `Error updating child with ID ${req.params.childId}`,
        });
      }
    } else res.send(data);
  });
};

// find child by childId
exports.findChildById = (req, res) => {
  // call model
  Child.findById(req.params.childId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with child ID ${req.params.childId}`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Child with child ID ${req.params.childId}`,
        });
      }
    } else res.send(data);
  });
};

// find child by carer Id
// may return multiple children
exports.findChildrenByCarerId = (req, res) => {
  Child.findByCarerId(req.params.carerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with carer ID ${req.params.carerId}`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Child with carer ID ${req.params.carerId}`,
        });
      }
    } else res.send(data);
  });
};

//find Journal by childId and date and return to frontend
exports.findJournal = (req, res) => {
  Child.findJournal(req.params.childId, req.params.date, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with child ID ${req.params.childId}`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Journal with child ID ${req.params.childId}`,
        });
      }
    } else res.send(data);
  });
};

// delete child - set timestamp, not deleted from database
exports.delete = (req, res) => {
  Child.delete(req.params.childId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Child not found with ID ${req.params.childId}`,
        });
      } else {
        res.status(500).send({
          message: `Could not delete child with ID ${req.params.childId}`,
        });
      }
    } else res.send({ message: "Child was deleted successfully!" });
  });
};
