module.exports = app => {
  const nursery = require('../controllers/nursery');

  app.get("/nurseries", nursery.getAllNurseries);
  app.get("/nurseries/:nurseryId", nursery.getNurseryById);
  app.get("/nurseries/:nurseryId/children", nursery.getAllChildren);
  app.get("/nurseries/:nurseryId/journal/add", nursery.getAllChildren);
};