const authJwt = require("../middleware/authJwt");
const carer = require("../controllers/carer");

module.exports = (app) => {
  // only admin users can add a carer
  app.post(
    "/carer/add",
    [authJwt.verifyToken, authJwt.isAdmin],
    carer.addCarer
  );
};
