const Child = require('../models/child');

exports.createChild = (req, res) => {
  const {role} = req.user;

  if (role !== 'admin') {
    return res.sendStatus(403);
  }

  const child = new Child({
    first_name: req.body.first_name,
    surname: req.body.surname,
    carer_id: req.body.carer_id,
  });

  Child.create(child,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while creating the child."
      });
    else res.send(data);
  });
};

exports.findAllChildren = (req, res) => {
  Child.findAll((err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'None found'
        });
      } else {
        res.status(500).send({
          message: 'Error retrieving children'
        });
      }
    } else res.send(data);
  });
};

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
