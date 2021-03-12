module.exports = app => {
  const authJwt = require('../middleware/authJwt');
  const carer = require("../controllers/carer");

  app.get("/carer/:userId", authJwt.verifyToken, carer.findCarerByUserId);
};