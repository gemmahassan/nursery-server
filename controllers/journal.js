const Journal = require('../models/journal');

exports.addJournalEntry = (req, res) => {
  Journal.create(req.params.nurseryId,(err, data) => {
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
  });
};

exports.getJournalTypes = (req, res) => {
  Journal.getTypes( (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || `Error retrieving journal types`
      });
    else res.send(data);
  });
};