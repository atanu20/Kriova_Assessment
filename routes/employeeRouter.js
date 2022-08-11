const router = require('express').Router();
const userCtrl = require('../controllers/employeeCtrl');
const auth = require('../middleware/auth');

router.post('/register', userCtrl.register);

router.post('/activation', userCtrl.activateEmail);

router.post('/login', userCtrl.login);

router.post('/refresh_token', userCtrl.getAccessToken);

router.post('/forgot', userCtrl.forgotPassword);

router.post('/reset', auth, userCtrl.resetPassword);

router.get('/infor', auth, userCtrl.getUserInfor);

router.patch('/userallthings', auth, userCtrl.updateAllDetails);
// Social Login

module.exports = router;
