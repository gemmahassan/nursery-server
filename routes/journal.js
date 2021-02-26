module.exports = app => {
  const journal = require("../controllers/journal");

  app.post("/nurseries/:nurseryId/journal/add", journal.addEntry);
  app.put("/child/:childId/journal/:journalId", journal.update);
  app.delete("/child/:childId/journal/:journalId", journal.delete);
};