const authJwt = require("../middleware/authJwt");
const journalType = require("../controllers/journal-type");

module.exports = (app) => {
  app.get("/journal/types", authJwt.verifyToken, journalType.getAll);
};
