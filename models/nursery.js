const sql = require('./db');

const Nursery = function(nursery) {
  this.name = nursery.name;
};

Nursery.create = (newNursery, result) => {
  sql.query("INSERT INTO nurseries SET ?", newNursery, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Created nursery: ", { id: res.insertId, ...newNursery });
    result(null, { id: res.insertId, ...newNursery });
  });
};

Nursery.getAllChildren = (nurseryId, result) => {
  console.log('nursery-model: ', nurseryId);
  sql.query(`SELECT * FROM children WHERE nursery_id = ${nurseryId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Retrieved children: ", res) ;
    result(null, res);
  });
};

Nursery.getAll = result => {
  sql.query("SELECT * FROM nurseries", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Nurseries: ", res);
    result(null, res);
  });
};

Nursery.findById = (nurseryId, result) => {
  sql.query(`SELECT * FROM nurseries WHERE id = ${nurseryId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found nursery: ', res[0]);
      result(null, res[0]);
      return;
    }
  });
};

module.exports = Nursery;
