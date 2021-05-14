const sql = require("./db");

const Journal = function (journal) {
  this.type_id = journal.type_id;
  this.image = journal.image;
  this.text = journal.text;
  this.child_id = journal.child_id;
  this.user_id = journal.user_id;
  this.nursery_id = journal.nursery_id;
};

Journal.create = (newJournal, result) => {
  sql.query("INSERT INTO journal SET ?", newJournal, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newJournal });
  });
};

Journal.update = (journalId, journal, result) => {
  sql.query(
    "UPDATE journal " +
      "SET child_id = ?," +
      "type_id = ?," +
      "image = ?," +
      "text = ?, " +
      "user_id = ? " +
      "WHERE id = ?",
    [
      journal.child_id,
      journal.type_id,
      journal.image,
      journal.text,
      journal.user_id,
      journalId,
    ],
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

      result(null, { id: journalId, ...journal });
    }
  );
};

Journal.remove = (id, result) => {
  sql.query(
    "UPDATE journal " + "SET deleted = CURRENT_TIMESTAMP() " + "WHERE id = ? ",
    id,
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

module.exports = Journal;
