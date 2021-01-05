module.exports = app => {
  const staff = require("../controllers/staff-controller");

  app.get("/staff/:nurseryId", staff.findStaffByNurseryId);
};