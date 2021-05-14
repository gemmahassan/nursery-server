const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const authJwt = require("../middleware/authJwt");
const child = require("../controllers/child");

module.exports = (app) => {
  app.post(
    "/children/add",
    [authJwt.verifyToken, authJwt.isAdmin, upload.single("image")],
    child.createChild
  );

  app.put(
    "/children/:childId",
    [authJwt.verifyToken, authJwt.isAdmin, upload.single("image")],
    child.update
  );

  app.get("/children/:childId", child.findChildById);
  app.get("/children/:childId/journal/:date", child.findJournal);
  app.get("/children/:carerId", child.findChildrenByCarerId);

  app.delete(
    "/children/:childId",
    [authJwt.verifyToken, authJwt.isAdmin],
    child.delete
  );
};
