module.exports = app => {
  const authJwt = require('../middleware/authJwt');
  const carer = require("../controllers/carer");

  app.post("/carer/add", authJwt.verifyToken, carer.addCarer);
  app.get("/carer/:userId", authJwt.verifyToken, carer.findCarerByUserId);
};