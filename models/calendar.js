const sql = require('./db');

const Calendar = function(calendar) {
  this.description = calendar.description;
  this.nursery_id = calendar.nursery_id;
};

Calendar.create = (newCalendar, result) => {
  sql.query("INSERT INTO calendar SET ?", newCalendar, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newCalendar });
  });
};

Calendar.findByNurseryId = (nurseryId, result) => {
  sql.query(`SELECT * FROM calendar WHERE nursery_id = ${nurseryId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }
  });
};

Calendar.update = (calendarId, calendar, result) => {
  sql.query(
    "UPDATE calendar " +
    "SET description = ? " +
    "WHERE id = ?",
    [calendar.description, calendarId],
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

      result(null, {id: calendarId, ...calendar});
    }
  );
}

Calendar.delete = (journalId, result) => {
  sql.query("DELETE FROM calendar WHERE id = ?", journalId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({kind: "not_found"}, null);
      return;
    }

    result(null, res);
  });
};


module.exports = Calendar;