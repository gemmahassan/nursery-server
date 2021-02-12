module.exports = app => {
  const journal = require("../controllers/journal");

  app.post("/nurseries/:nurseryId/journal/add", journal.addJournalEntry);
};