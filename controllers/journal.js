const Journal = require('../models/journal');

exports.addEntry = (req, res) => {
  // Journal.create(req.params.nurseryId, (err, data) => {
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
  // });
};

exports.updateEntry = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Journal.updateEntry(req.params.journalId, new Journal(req.body),
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