module.exports = app => {
  const child = require("../controllers/child");

  app.get("/child/:childId/journal/:date", child.findJournal);
  app.get("/children/:carerId", child.findChildrenByCarerId);
};