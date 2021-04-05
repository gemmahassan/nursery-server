const { authJwt } = require("../middleware");
const user = require('../controllers/user');
const multer = require("multer");
const upload = multer({dest: 'uploads/'});

module.exports = app => {
  app.get("/all", user.allAccess);
  app.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], user.adminDashBoard);
  app.get("/staff", [authJwt.verifyToken, authJwt.isStaff], user.staffDashBoard);
  app.get("/carer", [authJwt.verifyToken, authJwt.isCarer], user.carerDashBoard);
  app.get("/user", [authJwt.verifyToken, authJwt.isCarer], user.carerDashBoard);

  app.post(
    "/user/add",
    [authJwt.verifyToken, authJwt.isAdmin || authJwt.isSuperAdmin, upload.single('image')],
    user.addUser
  );

  app.get("/user/staff/:nurseryId", user.findStaffByNurseryId);
  app.get("/user/carers/:nurseryId", user.findCarersByNurseryId);
  app.get("/user/:userId/children", user.findChildren);

  app.delete(
    "/user/:userId",
    [authJwt.verifyToken, authJwt.isAdmin],
    user.delete
  );

  app.get("/user/:token", user.findUserByToken);
  app.put("/user/:userId", user.register);

  app.put("/user/:userId/edit", user.update);

};
