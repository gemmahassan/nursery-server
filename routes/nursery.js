const multer = require("multer");
const upload = multer({dest: 'uploads/'});
const nursery = require('../controllers/nursery');

module.exports = app => {
  app.post('/nursery/signup', upload.single('image'), nursery.signup);
  app.get("/nurseries", nursery.getAllNurseries);
  app.get("/nurseries/:nurseryId", nursery.getNurseryById);
  app.get("/nurseries/:nurseryId/children", nursery.getAllChildren);
  app.get("/nurseries/:nurseryId/journal/add", nursery.getAllChildren);
};
