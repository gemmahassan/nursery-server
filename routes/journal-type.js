module.exports = app => {
  const journalType = require("../controllers/journal-type");

  app.get("/journal/types", journalType.getAll);
};