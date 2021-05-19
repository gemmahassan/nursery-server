const sql = require("./db");

const Child = function (child) {
  this.first_name = child.first_name;
  this.surname = child.surname;
  this.image = child.image;
  this.nursery_id = child.nursery_id;
  this.photo_permission = child.photo_permission;
};

// insert a new child
Child.create = (newChild, result) => {
  sql.query("INSERT INTO children SET ?", newChild, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newChild });
  });
};

// update existing child
Child.update = (childId, child, result) => {
  sql.query(
    "UPDATE children " +
      "SET first_name = ?," +
      "surname = ?, " +
      "photo_permission = ?, " +
      "image = ? " +
      "WHERE id = ?",
    [
      child.first_name,
      child.surname,
      child.photo_permission,
      child.image,
      childId,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      // if no rows updated, return not found result
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: childId, ...child });
    }
  );
};

// find all children linked to specific nursery
Child.findByNurseryId = (nurseryId, result) => {
  sql.query(
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

      // add each child returned into new response array and return this to the frontend
      const response = res.map((child) => {
        if (child.image) {
          // convert image from BLOB so it can be displayed on frontend
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
// find child by specific ID, filter out deleted children
Child.findById = (childId, result) => {
  sql.query(
    `SELECT *
             FROM children
             WHERE id = ? 
             AND deleted IS NULL`,
    childId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }
    }
  );
};

// find children by specific carer ID
Child.findByCarerId = (carerId, result) => {
  sql.query(
    `SELECT *
             FROM children
             WHERE carer_user_id = ? 
             AND deleted IS NULL`,
    carerId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res);
        return;
      }
    }
  );
};

// find all journal entries for a specific child
// join users to get name of staff who added the entry
// join types to get type of journal entry
// filter out deleted entries
// descending order by date
Child.findJournal = (childId, date, result) => {
  sql.query(
    `SELECT journal.id,
            journal.child_id,
            journal.image,
            journal.text,
            journal.timestamp,
            journal.type_id,
            journal_types.type,
            journal.user_id,
            users.first_name,
            users.surname
     FROM journal
              INNER JOIN journal_types
                         ON journal.type_id = journal_types.id
              INNER JOIN users
                         ON journal.user_id = users.id
     WHERE journal.child_id = ?
       AND journal.deleted IS NULL
       AND DATE (journal.timestamp) = ?
     ORDER BY journal.timestamp DESC`,
    [childId, date],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      // store all entries into new response array and return to frontend
      const response = res.map((entry) => {
        if (entry.image) {
          // convert image from blob to base64 so it can be displayed on frontend
          entry.image =
            "data:image/png;base64," +
            Buffer.from(entry.image, "binary").toString("base64");
        }
        return entry;
      });
      result(null, response);
    }
  );
};

// delete child by setting deleted timestamp
// does not actually delete the data
// performed as a transaction to ensure that all affected tables are updated
Child.delete = (id, result) => {
  sql.query(
    "START TRANSACTION;" +
      "UPDATE children " +
      "SET deleted = CURRENT_TIMESTAMP() " +
      "WHERE id = ? ;" +
      "UPDATE carers " +
      "SET deleted = CURRENT_TIMESTAMP() " +
      "WHERE child_id = ?; " +
      "UPDATE journal " +
      "SET deleted = CURRENT_TIMESTAMP() " +
      "WHERE child_id = ?; " +
      "COMMIT;",
    [id, id, id],
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

      result(null, res);
    }
  );
};

module.exports = Child;
