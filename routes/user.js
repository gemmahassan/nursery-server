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
  app.post("/user/add", [authJwt.verifyToken, authJwt.isAdmin || authJwt.isSuperAdmin, upload.single('image')], user.addUser);
  app.get("/user/staff/:nurseryId", user.findStaffByNurseryId);
};
