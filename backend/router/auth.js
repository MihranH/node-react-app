const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const { registerValidation, loginValidation } = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');

router.post('/register', registerValidation, (req, res) => AuthController.register(req, res));
router.post('/login', loginValidation, (req, res) => AuthController.login(req, res));
router.get('/users/me', authenticate, (req, res) => AuthController.getUserInfo(req, res));

module.exports = router;