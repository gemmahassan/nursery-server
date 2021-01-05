module.exports = app => {
  const nursery = require('../controllers/nursery-controller');

  app.get("/nurseries", nursery.getAllNurseries);
};