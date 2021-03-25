const sql = require('./db');

const Nursery = function(nursery) {
  this.name = nursery.name;
  this.email = nursery.email;
  this.phone = nursery.phone;
  this.address_line_1 = nursery.addressLine1;
  this.address_line_2 = nursery.addressLine2;
  this.town = nursery.town;
  this.county = nursery.county;
  this.postcode = nursery.postcode;
  // this.pending = nursery.pending;
  this.image = nursery.image;
  this.color = nursery.color;
};

Nursery.create = (newNursery, result) => {
  console.log("calling nursery model");
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

Nursery.updateOnRegistration = (nurseryId, nursery, result) => {
  console.log(nursery);
  sql.query(
    "UPDATE nurseries " +
    "SET image = ?, " +
    "color = ?, " +
    "confirmed = ? " +
    "WHERE id = ?",
    [nursery.image, nursery.color, 1, nurseryId],
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

      result(null, {id: nurseryId, ...nurseryId});
    }
  );
}

Nursery.approve = (nurseryId, result) => {
  sql.query(
    "UPDATE nurseries " +
    "SET pending = ? " +
    "WHERE id = ?",
    [0, nurseryId],
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

      result(null, {id: nurseryId, ...nurseryId});
    }
  );
}

Nursery.decline = (nurseryId, result) => {
  sql.query(
    "DELETE FROM nurseries " +
    "WHERE id = ?",
    [nurseryId],
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

      console.log("deleted nursery: ", {id: nurseryId});
      result(null, {id: nurseryId, ...nurseryId});
    }
  );
}

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

Nursery.getAllConfirmed = result => {
  sql.query("SELECT * FROM nurseries WHERE confirmed = 1", (err, res) => {
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

Nursery.getAllPending = result => {
  sql.query("SELECT * FROM nurseries WHERE pending = 1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    const response = res.map(nursery => {
      if (nursery.image) {
        nursery.image = "data:image/png;base64," + Buffer.from(nursery.image, 'binary').toString('base64');
      }
      return nursery;
    });
    result(null, response);
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
      if (res[0].image) {
        res[0].image = "data:image/png;base64," + Buffer.from(res[0].image, 'binary' ).toString('base64');
      }
      result(null, res[0]);
      return;
    }
  });
};

module.exports = Nursery;
