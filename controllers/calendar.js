const Calendar = require("../models/calendar");

// TO DO : Calendar not fully implemented
exports.findByNurseryId = (req, res) => {
  Calendar.findByNurseryId(req.params.nurseryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with nursery ID ${req.params.nurseryId}`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving calendar entries with nursery ID ${req.params.nurseryId}`,
        });
      }
    } else res.send(data);
  });
};

exports.addEntry = (req, res) => {
  // only admin users have permission to add a calendar entry
  if (role !== "admin") {
    return res.sendStatus(403);
  }

  // Create a Journal Entry
  const entry = new Calendar({
    description: req.body.description,
    nursery_id: req.body.nursery_id,
  });

  // Save Journal in the database
  Calendar.create(entry, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "An error occurred while adding the entry.",
      });
    else res.send(data);
  });
};

exports.update = (req, res) => {
  // only admin users have permission to update a calendar entry
  if (role !== "admin") {
    return res.sendStatus(403);
  }

  Calendar.update(
    req.params.calendarId,
    new Calendar(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No entry found with ID ${req.params.calendarId}`,
          });
        } else {
          res.status(500).send({
            message: `Error updating Journal with ID ${req.params.calendarId}`,
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  // only admin users have permission to delete a calendar entry
  if (role !== "admin") {
    return res.sendStatus(403);
  }

  Calendar.delete(req.params.calendarId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Calendar entry not found with ID ${req.params.calendarId}`,
        });
      } else {
        res.status(500).send({
          message: `Could not delete calendar entry with ID ${req.params.calendarId}`,
        });
      }
    } else res.send({ message: "calendar entry was deleted successfully!" });
  });
};
