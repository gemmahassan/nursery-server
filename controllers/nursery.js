const Nursery = require('../models/nursery');

exports.getAllNurseries = (req, res) => {
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