const authJwt = require("../middleware/authJwt");
const journal = require("../controllers/journal");
const multer = require("multer");
const upload = multer({dest: 'uploads/'});

module.exports = app => {
  app.post("/nurseries/:nurseryId/journal/add", [authJwt.isStaff, upload.single('image')], journal.addEntry);
  app.put("/child/:childId/journal/:journalId", [authJwt.isStaff, upload.single('image')], journal.update);
  app.delete("/child/:childId/journal/:journalId", authJwt.isAdmin, journal.delete);
};