const sql = require('./db');

const Address = function(address) {
  this.line1 = address.line1;
  this.line2 = address.line1;
  this.town_id = address.town_id;
  this.county_id = address.county_id;
  this.postcode = address.postcode;
};

Address.create = (newAddress, result) => {
  sql.query("INSERT INTO address SET ?", newAddress, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newAddress });
  });
};

Address.getAll = result => {
  sql.query("SELECT * FROM addresses", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, res);
  });
};

Address.findById = (addressId, result) => {
  sql.query(`SELECT * FROM addresses WHERE id = ${addressId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found address: ', res[0]);
      result(null, res[0]);
      return;
    }
  });
};

module.exports = Address;
