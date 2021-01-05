const Nursery = require('../models/nursery-model');

exports.getAllNurseries = (req, res) => {
  Nursery.getAll( (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || `Error retrieving nurseries`
      });
    else res.send(data);
  });
};