module.exports = app => {
  const child = require("../controllers/child-controller");

  app.get("/child/:childId/journal", child.findJournal);
  app.get("/children/:carerId", child.findChildrenByCarerId);
};