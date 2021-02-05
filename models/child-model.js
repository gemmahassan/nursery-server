const sql = require('./db');

const Child = function(child) {
  this.firstName = child.firstName;
  this.lastName = child.lastName;
  this.nurseryId = child.nurseryId
  this.childId = child.childId;
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

Child.findByNurseryId = (nurseryId, result) => {
  sql.query(`SELECT * FROM children WHERE nursery_id = ${nurseryId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found child: ', res);
      result(null, res);
      return;
    }
  });
};

Child.findByCarerId = (carerId, result) => {
  sql.query(`SELECT * FROM children WHERE carer_id = ${carerId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found child: ', res);
      result(null, res);
      return;
    }
  });
};

Child.findJournal = (childId, result) => {
  sql.query(`SELECT * FROM journal WHERE child_id = ${childId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found journal: ', res);
      result(null, res);
      return;
    }
  });
};

module.exports = Child;