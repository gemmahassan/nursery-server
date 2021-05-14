const fs = require("fs");
const Child = require("../models/child");

exports.createChild = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  let image;
  if (req.file) {
    image = fs.readFileSync(req.file.path);
  }

  const child = new Child({
    first_name: req.body.first_name,
    surname: req.body.surname,
    image: image,
    nursery_id: req.body.nursery_id,
    photo_permission: req.body.photo_permission,
  });

  Child.create(child, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "An error occurred while adding the child.",
      });
    else res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  let image;
  if (req.file) {
    image = fs.readFileSync(req.file.path);
  }

  const child = new Child({
    first_name: req.body.first_name,
    surname: req.body.surname,
    image: image,
    photo_permission: req.body.photo_permission,
  });

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

exports.findAllChildren = (req, res) => {
  Child.findAll((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: "None found",
        });
      } else {
        res.status(500).send({
          message: "Error retrieving children",
        });
      }
    } else res.send(data);
  });
};

exports.findChildrenByNurseryId = (req, res) => {
  Child.findByNurseryId(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with nursery ID ${req.params.nurseryId}`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Child with nursery ID ${req.params.nurseryId}`,
        });
      }
    } else res.send(data);
  });
};

exports.findChildById = (req, res) => {
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
