const authJwt = require("../middleware/authJwt");
const journal = require("../controllers/journal");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports = (app) => {
  app.post(
    "/journal/:nurseryId",
    [authJwt.verifyToken, authJwt.isStaff, upload.single("image")],
    journal.addEntry
  );

  app.put(
    "/journal/:journalId",
    [authJwt.verifyToken, authJwt.isStaff, upload.single("image")],
    journal.update
  );

  app.put(
    "/journal/:journalId/delete",
    [authJwt.verifyToken, authJwt.isAdmin],
    journal.delete
  );
};
