module.exports = app => {
  const authJwt = require('../middleware/authJwt');
  const child = require("../controllers/child");

  app.post("/child", authJwt.verifyToken, child.createChild);
  app.get("/children", authJwt.verifyToken, child.findAllChildren);
  app.get("/child/:childId/journal/:date", child.findJournal);
  app.get("/children/:carerId", child.findChildrenByCarerId);
};