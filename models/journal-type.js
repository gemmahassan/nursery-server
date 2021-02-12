const sql = require('./db');

const JournalType = function(journalType) {
  this.type = journalType.type;
};

JournalType.getAll = result => {
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

module.exports = JournalType;