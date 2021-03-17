const sql = require('./db');

const Nursery = function(nursery) {
  this.name = nursery.name;
  // this.address_id = nursery.address_id;
  // this.contactName = nursery.contactName;
  // this.email = nursery.email;
  // this.phone = nursery.phone;
  // this.addressLine1 = nursery.addressLine1;
  // this.addressLine2 = nursery.addressLine2;
  // this.town = nursery.town;
  // this.postcode = nursery.postcode;
  this.image = nursery.image;
};
//


Nursery.create = (newNursery, result) => {
  sql.query("INSERT INTO nurseries SET ?", newNursery, (err, res) => {
  // sql.query(
    // "INSERT INTO nurseries SET ?",
    // `BEGIN;
    // INSERT INTO towns (town)
    //   VALUE(town);
    // INSERT INTO addresses (line1, line2, town_id, county_id, postcode)
    //   VALUES(line1, line2, LAST_INSERT_ID(), county_id, postcode);
    // INSERT INTO nurseries (name, address_id)
    //   VALUES(name, LAST_INSERT_ID();
    // COMMIT;` , (err, res) => {
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

    const response = res.map(nursery => {
      if (nursery.image) {
        nursery.image = "data:image/png;base64," + Buffer.from(nursery.image, 'binary' ).toString('base64');
      }
      return nursery;
    });
    result(null, response);
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
      res[0].image = "data:image/png;base64," + Buffer.from(res[0].image, 'binary' ).toString('base64');
      result(null, res[0]);
      return;
    }
  });
};

module.exports = Nursery;
