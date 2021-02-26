const sql = require('./db');

const Journal = function(journal) {
  this.id = journal.id;
  this.type_id = journal.type_id;
  this.image = journal.image;
  this.text = journal.text;
  this.child_id = journal.child_id;
  this.staff_id = journal.staff_id;
};

Journal.create = (newJournal, result) => {
  sql.query("INSERT INTO journal SET ?", newJournal, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Created journal entry: ", { id: res.insertId, ...newJournal });
    result(null, { id: res.insertId, ...newJournal });
  });
};

Journal.update = (journalId, journal, result) => {
  sql.query(
    "UPDATE journal " +
    "SET child_id = ?," +
    "type_id = ?," +
    "image = ?," +
    "text = ?" +
    "WHERE id = ?",
    [journal.child_id, journal.type_id, journal.image, journal.text, journalId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({kind: "not_found"}, null);
        return;
      }

      console.log("updated journal: ", {id: journalId, ...journal});
      result(null, {id: journalId, ...journal});
    }
  );
}

Journal.remove = (id, result) => {
  sql.query("DELETE FROM journal WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({kind: "not_found"}, null);
      return;
    }

    console.log(`deleted journal with ID: ${id}`);
    result(null, res);
  });
};

module.exports = Journal;