const router = require('express').Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');

router.post('/register', userCtrl.register);

module.exports = router;
