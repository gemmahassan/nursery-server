const Child = require('../models/child');

exports.findChildrenByNurseryId = (req, res) => {
  Child.findByNurseryId(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found with nursery ID ${req.params.nurseryId}`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Child with nursery ID ${req.params.nurseryId}`
        });
      }
    } else res.send(data);
  });
};

exports.findChildrenByCarerId = (req, res) => {
  Child.findByCarerId(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found with carer ID ${req.params.nurseryId}`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Child with carer ID ${req.params.nurseryId}`
        });
      }
    } else res.send(data);
  });
};

exports.findJournal = (req, res) => {
  Child.findJournal(req.params.childId, req.params.date, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found with child ID ${req.params.childId}`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Journal with child ID ${req.params.childId}`
        });
      }
    } else res.send(data);
  });
};