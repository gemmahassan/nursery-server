const fs = require("fs");
const Journal = require("../models/journal");

exports.addEntry = (req, res) => {
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

  // Create a Journal Entry
  const entry = new Journal({
    type_id: req.body.type_id,
    image: image,
    text: req.body.text,
    child_id: req.body.child_id,
    user_id: req.body.user_id,
    nursery_id: req.body.nursery_id,
  });

  // Save Journal in the database
  Journal.create(entry, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "An error occurred while adding the entry.",
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

  // Create a Journal Entry
  const entry = new Journal({
    type_id: req.body.type_id,
    image: image,
    text: req.body.text,
    child_id: req.body.child_id,
    user_id: req.body.user_id,
  });

  Journal.update(req.params.journalId, entry, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No entry found with ID ${req.params.journalId}`,
        });
      } else {
        res.status(500).send({
          message: `Error updating Journal with ID ${req.params.journalId}`,
        });
      }
    } else res.send(data);
  });
};

exports.delete = (req, res) => {
  Journal.remove(req.params.journalId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Journal entry not found with ID ${req.params.journalId}`,
        });
      } else {
        res.status(500).send({
          message: `Could not delete journal entry with ID ${req.params.journalId}`,
        });
      }
    } else res.send({ message: "Journal entry was deleted successfully!" });
  });
};
