const sql = require('./db');

const Carer = function (carer) {
  this.child_id = carer.child_id;
  this.user_id = carer.user_id;
  this.nursery_id = carer.nursery_id;
};

Carer.create = (newCarer, result) => {
  sql.query("INSERT INTO carers SET ?", newCarer, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, {id: res.insertId, ...newCarer});
  });
};

module.exports = Carer;