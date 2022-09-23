const router = require('express').Router();
const uploadImage = require('../middleware/uploadImage');
const uploadCtrl = require('../controllers/uploadCtrl');
const auth = require('../middleware/auth');

router.post('/avatar', uploadImage, auth, uploadCtrl.uploadAvatar);
// router.post('/csv_file', auth, uploadCtrl.upload_csv_file);
router.post('/csv_file', uploadCtrl.upload_csv_file);

module.exports = router;
