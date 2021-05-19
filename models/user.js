const sql = require("./db");
const bcrypt = require("bcrypt");

const User = function (user) {
  this.first_name = user.first_name;
  this.surname = user.surname;
  this.username = user.username;
  this.password = user.password;
  this.nursery_id = user.nursery_id;
  this.token = user.token;
  switch (user.role) {
    case "admin":
      this.user_role_id = 500;
      return;
    case "staff":
      this.user_role_id = 501;
      return;
    case "carer":
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

    result(null, { id: res.insertId, ...newUser });
  });
};

User.register = (userId, password, result) => {
  console.log("in model");
  sql.query(
    "UPDATE users " +
      "SET password = ?, " +
      "activated = 1, " +
      "token = NULL " +
      "WHERE id = ?",
    [password, userId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: userId });
    }
  );
};

User.update = (userId, user, result) => {
  sql.query(
    "UPDATE users " + "SET first_name = ?, " + "surname = ? " + "WHERE id = ?",
    [user.first_name, user.surname, userId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: userId, ...user });
    }
  );
};

User.findById = (userId, result) => {
  sql.query("SELECT * FROM users WHERE users.id = ?", userId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    } else {
      result({ kind: "not_found" }, null);
      return;
    }
  });
};

User.findByUsername = (username, result) => {
  sql.query("SELECT * FROM users WHERE username = ?", username, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    // return result when matching username is found
    if (res.length) {
      result(null, res[0]);
      return;
    }

    // return if nothing is returned so middleware can verify unique username
    result(null, null);
    return;
  });
};

User.findAdmin = (result) => {
  sql.query("SELECT * FROM users WHERE user_role_id = ?", 500, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    } else {
      result({ kind: "not_found" }, null);
      return;
    }
  });
};

User.findStaffByNurseryId = (nurseryId, result) => {
  sql.query(
    "SELECT * FROM users " +
      "WHERE (user_role_id = ?  OR user_role_id = ?) " +
      "AND nursery_id = ? " +
      "AND deleted IS NULL " +
      "ORDER BY surname",
    [500, 501, nurseryId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res);
        return;
      } else {
        result({ kind: "not_found" }, null);
        return;
      }
    }
  );
};

User.findCarersByNurseryId = (nurseryId, result) => {
  sql.query(
    "SELECT * FROM users " +
      "WHERE user_role_id = ? " +
      "AND nursery_id = ? " +
      "AND deleted IS NULL " +
      "ORDER BY surname",
    [502, nurseryId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res);
        return;
      } else {
        result({ kind: "not_found" }, null);
        return;
      }
    }
  );
};

User.findUserByToken = (token, result) => {
  sql.query(
    "SELECT * FROM users WHERE token = ? AND activated = 0",
    token,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res);
        return;
      } else {
        result({ kind: "not_found" }, null);
        return;
      }
    }
  );
};

User.findChildren = (userId, result) => {
  sql.query(
    "SELECT children.id, " +
      "children.first_name, " +
      "children.surname " +
      "FROM carers " +
      "INNER JOIN children " +
      "ON carers.child_id = children.id " +
      "WHERE carers.user_id = ? " +
      "AND children.deleted IS NULL " +
      "ORDER BY children.surname",
    userId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res);
        return;
      } else {
        result({ kind: "not_found" }, null);
        return;
      }
    }
  );
};

// gets user and role data
// matches username by case
// filters deleted users
User.login = (password, username, result) => {
  sql.query(
    "SELECT " +
      "users.id, " +
      "users.activated, " +
      "users.username, " +
      "users.first_name, " +
      "users.surname, " +
      "users.password, " +
      "users.user_role_id, " +
      "users.nursery_id, " +
      "user_roles.role " +
      "FROM users " +
      "INNER JOIN user_roles " +
      "ON users.user_role_id = user_roles.id " +
      "WHERE binary users.username = ? " +
      "AND users.deleted IS NULL ",
    username,
    async (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      // if there is a matching user, hash the entered password and compare with the hashed password saved in the database
      if (res.length) {
        const comparison = await bcrypt.compare(password, res[0].password);
        if (comparison) {
          result(null, res[0]);
          return;
        } else {
          console.log("username and password do not match");
          result(null);
          return;
        }
      } else {
        console.log("no user found");
        result(null);
        return;
      }
    }
  );
};

User.delete = (id, result) => {
  sql.query(
    "START TRANSACTION; " +
      "UPDATE nursery_journal.users " +
      "SET deleted = current_timestamp() " +
      "WHERE id = ?; " +
      "UPDATE nursery_journal.carers " +
      "SET deleted = current_timestamp() " +
      "WHERE user_id = ?; " +
      "COMMIT;",
    [id, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, res);
    }
  );
};

module.exports = User;
