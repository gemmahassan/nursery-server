const fs = require("fs");
const Journal = require('../models/journal');

exports.addEntry = (req, res) => {
  // only admin and staff users have permission to add a journal entry
  if (role !== 'admin' || 'staff') {
    return res.sendStatus(403);
  }

  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Journal Entry
  const entry = new Journal({
    type_id: req.body.type_id,
    image: req.body.image,
    text: req.body.text,
    child_id: req.body.child_id,
    staff_id: req.body.staff_id,
  });

  // Save Journal in the database
  Journal.create(entry, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while adding the entry."
      });
    else res.send(data);
  });
};

exports.update = (req, res) => {
  // only admin and staff users have permission to update a journal entry
  if (role !== 'admin' || 'staff') {
    return res.sendStatus(403);
  }

  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Journal.update(req.params.journalId, new Journal(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No entry found with ID ${req.params.journalId}`
          });
        } else {
          res.status(500).send({
            message: `Error updating Journal with ID ${req.params.journalId}`
          })
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  // only admin and staff users have permission to delete a journal entry
  if (role !== 'admin' || 'staff') {
    return res.sendStatus(403);
  }

  Journal.remove(req.params.journalId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Journal entry not found with ID ${req.params.journalId}`
        });
      } else {
        res.status(500).send({
          message: `Could not delete journal entry with ID ${req.params.journalId}`
        });
      }
    } else res.send({message: "Journal entry was deleted successfully!"});
  });
};
