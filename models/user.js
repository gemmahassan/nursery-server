const sql = require('./db');
const bcrypt = require('bcrypt');

const User = function (user) {
  this.first_name = user.first_name;
  this.surname = user.surname;
  this.username = user.username;
  this.password = user.password;
  this.nursery_id = user.nursery_id;
  this.image = user.image;
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

User.login = (password, username, result) => {
  sql.query(
    `SELECT 
      users.id,
      users.activated,
      users.username,
      users.password,
      users.user_role_id,
      users.nursery_id,
      users.image,
      user_roles.role
     FROM users 
     INNER JOIN user_roles
       ON users.user_role_id = user_roles.id
     WHERE users.username = '${username}'`, async (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      // if there is a matching user, hash the entered password and compare with the hashed password saved in the database
      if (res.length) {
        const comparison = await bcrypt.compare(password, res[0].password);
        if (comparison) {
          console.log('found user: ', res[0]);
          result(null, res[0]);
          return;
        } else {
          console.log('username and password do not match');
          result(null);
          return;
        }
      } else {
        console.log('no user found');
        result(null);
        return;
      }
    });
};

module.exports = User;