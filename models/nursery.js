const sql = require("./db");

const Nursery = function (nursery) {
  this.name = nursery.name;
  this.email = nursery.email;
  this.phone = nursery.phone;
  this.contact_first_name = nursery.contact_first_name;
  this.contact_surname = nursery.contact_surname;
  this.address_line_1 = nursery.addressLine1;
  this.address_line_2 = nursery.addressLine2;
  this.town = nursery.town;
  this.county = nursery.county;
  this.postcode = nursery.postcode;
  this.image = nursery.image;
  this.color = nursery.color;
  this.latitude = nursery.latitude;
  this.longitude = nursery.longitude;
};

Nursery.create = (newNursery, result) => {
  sql.query("INSERT INTO nurseries SET ?", newNursery, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newNursery });
  });
};

Nursery.approve = (nurseryId, result) => {
  sql.query(
    "UPDATE nurseries " + "SET confirmed = 1 " + "WHERE id = ?",
    nurseryId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: nurseryId, ...nurseryId });
    }
  );
};

Nursery.decline = (nurseryId, result) => {
  sql.query(
    "START TRANSACTION; " +
      "DELETE FROM users WHERE nursery_id = ?; " +
      "DELETE FROM nurseries WHERE id = ?; " +
      "COMMIT; ",
    [nurseryId, nurseryId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: nurseryId, ...nurseryId });
    }
  );
};

Nursery.purge = (req, result) => {
  sql.query(
    "START TRANSACTION; " +
      "DELETE FROM journal WHERE deleted < (NOW() - INTERVAL 90 DAY); " +
      "DELETE FROM carers WHERE deleted < (NOW() - INTERVAL 90 DAY); " +
      "DELETE FROM users WHERE deleted < (NOW() - INTERVAL 90 DAY); " +
      "DELETE FROM children WHERE deleted < (NOW() - INTERVAL 90 DAY); " +
      "DELETE FROM calendar WHERE deleted < (NOW() - INTERVAL 90 DAY); " +
      "DELETE FROM nurseries WHERE deleted < (NOW() - INTERVAL 90 DAY); " +
      "COMMIT;",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      let totalAffectedRows = 0;
      res.forEach((el) => {
        totalAffectedRows += el.affectedRows;
      });

      if (totalAffectedRows === 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, res);
    }
  );
};

Nursery.getAllChildren = (nurseryId, result) => {
  sql.query(
    "" +
      "SELECT * FROM children " +
      "WHERE nursery_id = ? " +
      "AND deleted IS NULL " +
      "ORDER BY surname",
    nurseryId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      const response = res.map((child) => {
        if (child.image) {
          child.image =
            "data:image/png;base64," +
            Buffer.from(child.image, "binary").toString("base64");
        }
        return child;
      });
      result(null, response);
    }
  );
};

Nursery.getAllConfirmed = (result) => {
  sql.query(
    "SELECT * FROM nurseries " +
      "WHERE confirmed = 1 " +
      "AND deleted IS NULL " +
      "ORDER BY name",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      const response = res.map((nursery) => {
        if (nursery.image) {
          nursery.image =
            "data:image/png;base64," +
            Buffer.from(nursery.image, "binary").toString("base64");
        }
        return nursery;
      });
      result(null, response);
    }
  );
};

Nursery.getAllPending = (result) => {
  sql.query(
    "SELECT * FROM nurseries " +
      "WHERE confirmed = 0 " +
      "AND deleted IS NULL " +
      "ORDER BY name",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      const response = res.map((nursery) => {
        if (nursery.image) {
          nursery.image =
            "data:image/png;base64," +
            Buffer.from(nursery.image, "binary").toString("base64");
        }
        return nursery;
      });
      result(null, response);
    }
  );
};

Nursery.findById = (nurseryId, result) => {
  sql.query(
    "SELECT * FROM nurseries WHERE id = ? AND deleted IS NULL",
    nurseryId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        if (res[0].image) {
          res[0].image =
            "data:image/png;base64," +
            Buffer.from(res[0].image, "binary").toString("base64");
        }
        result(null, res[0]);
        return;
      }
    }
  );
};

Nursery.deactivate = (nurseryId, result) => {
  sql.query(
    "START TRANSACTION; " +
      "UPDATE nurseries " +
      "SET nurseries.deleted = CURRENT_TIMESTAMP() " +
      "WHERE nurseries.id = ?;" +
      "UPDATE children " +
      "SET children.deleted = CURRENT_TIMESTAMP() " +
      "WHERE children.nursery_id = ?;" +
      "UPDATE users " +
      "SET users.deleted = CURRENT_TIMESTAMP() " +
      "WHERE users.nursery_id = ?;" +
      "UPDATE calendar " +
      "SET calendar.deleted = CURRENT_TIMESTAMP() " +
      "WHERE calendar.nursery_id = ?;" +
      "UPDATE carers " +
      "SET carers.deleted = CURRENT_TIMESTAMP() " +
      "WHERE carers.nursery_id = ?;" +
      "UPDATE journal " +
      "SET journal.deleted = CURRENT_TIMESTAMP() " +
      "WHERE journal.nursery_id = ?;" +
      "COMMIT; ",
    [nurseryId, nurseryId, nurseryId, nurseryId, nurseryId, nurseryId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result(null, res);
        return;
      }

      result(null, { id: nurseryId, ...nurseryId });
    }
  );
};

module.exports = Nursery;
