const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const authJwt = require("../middleware/authJwt");
const child = require("../controllers/child");

module.exports = (app) => {
  // only admin users can add a child
  app.post(
    "/children/add",
    [authJwt.verifyToken, authJwt.isAdmin, upload.single("image")],
    child.createChild
  );

  // only admin users can update a child
  app.put(
    "/children/:childId",
    [authJwt.verifyToken, authJwt.isAdmin, upload.single("image")],
    child.update
  );

  app.get("/children/:childId", authJwt.verifyToken, child.findChildById);
  app.get(
    "/children/:childId/journal/:date",
    authJwt.verifyToken,
    child.findJournal
  );
  app.get(
    "/children/:carerId",
    authJwt.verifyToken,
    child.findChildrenByCarerId
  );

  // only admin users can delete a child
  app.delete(
    "/children/:childId",
    [authJwt.verifyToken, authJwt.isAdmin],
    child.delete
  );
};
