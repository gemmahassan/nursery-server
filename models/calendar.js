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

    console.log("Created calendar entry: ", { id: res.insertId, ...newCalendar });
    result(null, { id: res.insertId, ...newCalendar });
  });
};

Calendar.findByNurseryId = (nurseryId, result) => {
  console.log("entering model");
  sql.query(`SELECT * FROM calendar WHERE nursery_id = ${nurseryId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found calendar: ', res);
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

      console.log("updated journal: ", {id: calendarId, ...calendar});
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

    console.log(`deleted calendar entry with ID: ${journal}`);
    result(null, res);
  });
};


module.exports = Calendar;