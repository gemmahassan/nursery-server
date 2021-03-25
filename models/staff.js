const sql = require('./db');

const Staff = function(staff) {
  this.first_name = staff.first_name;
  this.surname = staff.surname;
  this.nursery_id = staff.nursery_id;
  this.image = staff.image;
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

module.exports = Staff;