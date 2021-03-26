module.exports = app => {
  const staff = require("../controllers/staff");
  const multer = require("multer");
  const upload = multer({dest: 'uploads/'});
  const authJwt = require('../middleware/authJwt');

  app.put("/staff/:staffId/update",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      upload.single('image')
    ],
    staff.update);
  app.get("/staff/:nurseryId", staff.findStaffByNurseryId);
  app.post(
    "/staff/add",
    [
    authJwt.verifyToken,
    authJwt.isAdmin,
    upload.single('image')
  ],
    staff.create);
};