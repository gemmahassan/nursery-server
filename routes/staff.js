module.exports = app => {
  const staff = require("../controllers/staff");

  app.get("/staff/:nurseryId", staff.findStaffByNurseryId);
};