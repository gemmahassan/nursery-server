module.exports = app => {
  const nursery = require('../controllers/nursery-controller');

  app.get("/nurseries", nursery.getAllNurseries);
  app.get("/nurseries/:nurseryId/children", nursery.getAllChildren);
};