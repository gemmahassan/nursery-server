const sql = require('./db');

const Child = function(child) {
  this.first_name = child.first_name;
  this.surname = child.surname;
  this.image = child.image;
  this.nursery_id = child.nursery_id;
  this.photo = child.photo ? 1 : 0;
};

Child.create = (newChild, result) => {
  sql.query("INSERT INTO children SET ?", newChild, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Created child: ", { id: res.insertId, ...newChild });
    result(null, { id: res.insertId, ...newChild });
  });
};

Child.update = (childId, child, result) => {
  sql.query(
    "UPDATE children " +
    "SET first_name = ?," +
    "surname = ?," +
    "photo = ?," +
    "image = ? " +
    "WHERE id = ?",
    [child.first_name, child.surname, child.image, childId],
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

      console.log("updated child: ", {id: childId, ...child});
      result(null, {id: childId, ...child});
    }
  );
}

Child.findAll = result => {
  sql.query('SELECT * FROM children', (err, res) => {
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

Child.findByNurseryId = (nurseryId, result) => {
  sql.query(`SELECT * FROM children WHERE nursery_id = ${nurseryId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    const response = res.map(child => {
      if (child.image) {
        child.image = "data:image/png;base64," + Buffer.from(child.image, 'binary' ).toString('base64');
      }
      return child;
    });
    result(null, response);
  });
};

Child.findByCarerId = (carerId, result) => {
  sql.query(`SELECT * FROM children WHERE carer_user_id = ${carerId}`, (err, res) => {
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

Child.findJournal = (childId, date, result) => {
  sql.query(
    `SELECT 
       journal.id,
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
        ON journal.type_id=journal_types.id
     INNER JOIN users
        ON journal.user_id=users.id
     WHERE journal.child_id = ${childId}
     AND DATE(journal.timestamp) = '${date}'
     ORDER BY journal.timestamp DESC`,
    (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

      const response = res.map(entry => {
        if (entry.image) {
          entry.image = "data:image/png;base64," + Buffer.from(entry.image, 'binary' ).toString('base64');
        }
        return entry;
      });
      result(null, response);
  });
};

module.exports = Child;