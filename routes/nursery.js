const multer = require("multer");
const upload = multer({dest: 'uploads/'});
const nursery = require('../controllers/nursery');

module.exports = app => {
  app.post('/contact', nursery.signup);
  app.put('/signup/:nurseryId', upload.single('image'), nursery.updateOnRegistration);
  app.put('/admin/:nurseryId/approve', nursery.approve);
  app.delete('/admin/:nurseryId/decline', nursery.decline);
  app.get("/nurseries", nursery.getAll);
  app.get("/nurseries/confirmed", nursery.getAllConfirmedNurseries);
  app.get("/nurseries/pending", nursery.getAllPendingNurseries);
  app.get("/nurseries/:nurseryId", nursery.getNurseryById);
  app.get("/nurseries/:nurseryId/children", nursery.getAllChildren);
  app.get("/nurseries/:nurseryId/journal/add", nursery.getAllChildren);

};
