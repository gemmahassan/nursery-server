const jwt = require("jsonwebtoken");
const { secret } = require("../config/auth");

verifyToken = (req, res, next) => {
  // extract token from the header passed from frontend
  const token = req.headers["x-access-token"];

  // if token exists, verify it against the stored secret
  // if it can not be verified or no token provided, send 401 unauthorised error
  // if it can be verified, save the userId, nurseryId role decoded from the token and pass to controller
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorised",
        });
      }

      req.userId = decoded.id;
      req.role = decoded.role;
      if (decoded.nurseryId) {
        req.nurseryId = decoded.nurseryId;
      }

      next();
    });
  } else {
    res.status(401).send({
      message: "No token provided",
    });
  }
};

// check superadmin privileges
isSuperAdmin = (req, res, next) => {
  if (req.role === "superadmin") {
    next();
    return;
  }

  res.status(403).send({
    message: "Requires superadmin permission",
  });
};

// check admin privileges
isAdmin = (req, res, next) => {
  if (req.role === "superadmin" || req.role === "admin") {
    next();
    return;
  }

  res.status(403).send({
    message: "Requires admin permission",
  });
};

// check carer privileges
isCarer = (req, res, next) => {
  if (req.role === "carer") {
    next();
    return;
  }

  res.status(403).send({
    message: "Requires carer permission",
  });
};

// check staff privileges
isStaff = (req, res, next) => {
  if (req.role === "admin" || "staff") {
    next();
    return;
  }

  res.status(403).send({
    message: "Requires staff permission",
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isSuperAdmin: isSuperAdmin,
  isAdmin: isAdmin,
  isCarer: isCarer,
  isStaff: isStaff,
};

module.exports = authJwt;
