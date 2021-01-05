const Staff = require('../models/staff-model');

exports.findStaffByNurseryId = (req, res) => {
  Staff.findByNurseryId(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found with nursery ID ${req.params.nurseryId}`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Staff with nursery ID ${req.params.nurseryId}`
        });
      }
    } else res.send(data);
  });
};