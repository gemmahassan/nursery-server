const authJwt = require("../middleware/authJwt");

module.exports = app => {
  const journal = require("../controllers/journal");

  app.post("/nurseries/:nurseryId/journal/add", authJwt, journal.addEntry);
  app.put("/child/:childId/journal/:journalId", authJwt, journal.update);
  app.delete("/child/:childId/journal/:journalId", authJwt, journal.delete);
};