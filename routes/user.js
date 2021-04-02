const { authJwt } = require("../middleware");
const user = require('../controllers/user');

module.exports = app => {
  app.get("/all", user.allAccess);
  app.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], user.adminDashBoard);
  app.get("/staff", [authJwt.verifyToken, authJwt.isStaff], user.staffDashBoard);
  app.get("/carer", [authJwt.verifyToken, authJwt.isCarer], user.carerDashBoard);
  app.get("/user", [authJwt.verifyToken, authJwt.isCarer], user.carerDashBoard);
  app.post("/user/add", [authJwt.verifyToken, authJwt.isAdmin || authJwt.isSuperAdmin], user.addUser);
};
