module.exports = app => {
  const authJwt = require('../middleware/authJwt');
  const child = require("../controllers/child");

  app.post("/child", authJwt, child.createChild);
  app.get("/children", authJwt, child.findAllChildren);
  app.get("/child/:childId/journal/:date", child.findJournal);
  app.get("/children/:carerId", child.findChildrenByCarerId);
};