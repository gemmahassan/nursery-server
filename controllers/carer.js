const Carer = require('../models/carer');

exports.findCarerByUserId = (req, res) => {
  Staff.findByNurseryId(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found with user ID ${req.params.userId}`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Carer with user ID ${req.params.userId}`
        });
      }
    } else res.send(data);
  });
};