module.exports = app => {
  const multer = require("multer");
  const upload = multer({dest: 'uploads/'});
  const authJwt = require('../middleware/authJwt');
  const child = require("../controllers/child");

  app.post(
    "/child/add",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      upload.single('image')
    ],
    child.createChild
  );
  app.put("/children/:childId", [authJwt.verifyToken, authJwt.isAdmin, upload.single('image')], child.update);
  app.get("/children", authJwt.verifyToken, child.findAllChildren);
  app.get("/child/:childId/journal/:date", child.findJournal);
  app.get("/:parentId/child/:childId/journal/:date", child.findJournal);
  app.get("/children/:carerId", child.findChildrenByCarerId);
};
