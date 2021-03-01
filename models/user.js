const sql = require('./db');

const User = function (user) {
  this.username = user.username;
  this.password = user.password;
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
    `SELECT * 
    FROM users 
    INNER JOIN user_roles
       ON users.user_role_id = user_roles.id
    WHERE users.username = '${username}' AND users.password = '${password}'`, (err, res) => {
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
module.exports = User;