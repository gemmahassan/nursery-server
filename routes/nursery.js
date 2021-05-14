const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const nursery = require("../controllers/nursery");
const authJwt = require("../middleware/authJwt");

module.exports = (app) => {
  app.post("/nurseries/contact", upload.single("image"), nursery.signup);
  app.get("/nurseries", nursery.getAll);
  app.get("/nurseries/confirmed", nursery.getAllConfirmedNurseries);
  app.get("/nurseries/pending", nursery.getAllPendingNurseries);
  app.get("/nurseries/:nurseryId", nursery.getNurseryById);
  app.get("/nurseries/:nurseryId/children", nursery.getAllChildren);

  app.put(
    "/nurseries/:nurseryId/approve",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    nursery.approve
  );

  app.delete(
    "/nurseries/:nurseryId/decline",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    nursery.decline
  );

  app.delete(
    "/nurseries/purge",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    nursery.purge
  );

  app.put(
    "/nurseries/:nurseryId/deactivate",
    [authJwt.verifyToken, authJwt.isAdmin],
    nursery.deactivate
  );
};
