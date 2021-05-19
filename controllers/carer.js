const Carer = require("../models/carer");

// add a new carer to junction table
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
