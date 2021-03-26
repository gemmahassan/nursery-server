const sql = require('./db');

const Staff = function(staff) {
  this.first_name = staff.first_name;
  this.surname = staff.surname;
  this.email = staff.email;
  this.image = staff.image;
  this.user_id = staff.user_id;
  this.nursery_id = staff.nursery_id;
};

Staff.create = (newStaff, result) => {
  sql.query("INSERT INTO staff SET ?", newStaff, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Created staff: ", { id: res.insertId, ...newStaff });
    result(null, { id: res.insertId, ...newStaff });
  });
};

Staff.findByNurseryId = (nurseryId, result) => {
  sql.query(`SELECT * FROM staff WHERE nursery_id = ${nurseryId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found staff: ', res);
      result(null, res);
      return;
    }
  });
};

Staff.update = (staffId, userId, result) => {
  console.log("userId", userId);

  console.log("staffId", staffId);
  sql.query(
    "UPDATE staff " +
    "SET user_id = ? " +
    "WHERE id = ?",
    [userId, staffId],
    (err, res) => {
      console.log("err: ", err);
      console.log("res: ", res);
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({kind: "not_found"}, null);
        return;
      }

      result(null, {id: staffId, ...staffId});
    }
  );
}

module.exports = Staff;