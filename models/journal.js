const sql = require('./db');

const Journal = function(journal) {
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

Journal.getTypes = result => {
  sql.query("SELECT * FROM journal_types", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Journal types: ", res);
    result(null, res);
  });
};

module.exports = Journal;