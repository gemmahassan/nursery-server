const Carer = require("../models/carer");

exports.addCarer = (req, res) => {
  const carer = new Carer({
    child_id: req.body.childId,
    user_id: req.body.userId,
    nursery_id: req.body.nurseryId,
  });

  Carer.create(carer, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "An error occurred while adding the carer.",
      });
    else res.send(data);
  });
};

exports.findCarerByUserId = (req, res) => {
  Staff.findByNurseryId(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with user ID ${req.params.userId}`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Carer with user ID ${req.params.userId}`,
        });
      }
    } else res.send(data);
  });
};
