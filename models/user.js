const sql = require('./db');

const User = function (user) {
  this.username = user.username;
  // this.password = user.password;
  switch (user.role) {
    case 'admin':
      this.user_role_id = 500;
      return;
    case 'staff':
      this.user_role_id = 501;
      return;
    case 'carer':
      this.user_role_id = 502;
      return;
  }
};


User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Created user: ", {id: res.insertId, ...newUser});
    result(null, {id: res.insertId, ...newUser});
  });
};

User.findById = (userId, result) => {
  sql.query(
    `SELECT * FROM users 
    WHERE users.id = '${userId}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log('found user: ', res[0]);
        result(null, res[0]);
        return;
      }
    });
};

User.findByUsername = (username, result) => {
  sql.query(`SELECT * FROM users WHERE username = ${username}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found user: ', res[0]);
      result(null, res[0]);
      return;
    }
  });
};

User.findByUsernameAndPassword = (password, username, result) => {
  sql.query(
    `SELECT 
      users.id,
      users.username,
      users.user_role_id,
      users.nursery_id,
      user_roles.role
     FROM users 
     INNER JOIN user_roles
       ON users.user_role_id = user_roles.id
     WHERE users.username = '${username}' AND users.password = '${password}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("res: ", res);
      if (res.length) {
        console.log('found user: ', res[0]);
        result(null, res[0]);
        return;
      } else {
        console.log('no user found');
        result(null);
        return;
      }
    });
};

module.exports = User;