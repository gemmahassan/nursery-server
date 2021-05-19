const JournalType = require("../models/journal-type");

// get all journal types
exports.getAll = (req, res) => {
  JournalType.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || `Error retrieving journal types`,
      });
    else res.send(data);
  });
};
