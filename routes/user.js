const { authJwt, verifySignUp } = require("../middleware");
const user = require("../controllers/user");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports = (app) => {
  app.post(
    "/users/add",
    [
      authJwt.verifyToken,
      authJwt.isAdmin || authJwt.isSuperAdmin,
      verifySignUp.checkDuplicateUsername,
      upload.single("image"),
    ],
    user.addUser
  );

  app.get(
    "/users/staff/:nurseryId",
    authJwt.verifyToken,
    user.findStaffByNurseryId
  );
  app.get(
    "/users/carers/:nurseryId",
    authJwt.verifyToken,
    user.findCarersByNurseryId
  );
  app.get("/users/:userId/children", authJwt.verifyToken, user.findChildren);

  app.put(
    "/users/:userId/delete",
    [authJwt.verifyToken, authJwt.isAdmin],
    user.delete
  );

  app.get("/users/:token", user.findUserByToken);
  app.put("/users/:userId", user.register);

  app.put("/users/:userId/edit", authJwt.verifyToken, user.update);
};
