module.exports = (app) => {
  const authJwt = require("../middleware/authJwt");
  const calendar = require("../controllers/calendar");

  app.post(
    "/calendar/add",
    [authJwt.verifyToken, authJwt.isAdmin],
    calendar.addEntry
  );

  app.get("/calendar/:nurseryId", calendar.findByNurseryId);

  app.put(
    "/calendar/:calendarId",
    [authJwt.verifyToken, authJwt.isAdmin],
    calendar.update
  );

  app.delete("/calendar/:calendarId", calendar.delete);
};
