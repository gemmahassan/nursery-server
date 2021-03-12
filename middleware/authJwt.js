const jwt = require("jsonwebtoken");
const {secret} = require("../config/auth");

verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorised"
        });
      }

      req.userId = decoded.id;
      req.role = decoded.role;
      req.nurseryId = decoded.nurseryId;
      next();
    });
  } else {
    res.status(401).send({
      message: "No token provided"
    });
  }
};

isAdmin = (req, res, next) => {
  if (req.role === "admin") {
    next();
    return;
  }

  res.status(403).send({
    message: "Requires admin permission"
  });
};

isCarer = (req, res, next) => {
  if (req.role === "carer") {
    next();
    return;
  }

  res.status(403).send({
    message: "Requires carer permission"
  });
};

isStaff = (req, res, next) => {
  if (req.role === "staff") {
    next();
    return;
  }

  res.status(403).send({
    message: "Requires staff permission"
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isCarer: isCarer,
  isStaff: isStaff,
};

module.exports = authJwt;

