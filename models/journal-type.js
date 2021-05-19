const sql = require("./db");

const JournalType = function (journalType) {
  this.type = journalType.type;
};

// retrieve all journal types
JournalType.getAll = (result) => {
  sql.query("SELECT * FROM journal_types", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, res);
  });
};

module.exports = JournalType;
