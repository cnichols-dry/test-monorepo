const userController = require('../controllers/user');
const router = require('express').Router();

router.post('/signup',userController.createUser);
router.post('/login',userController.userLogin);

module.exports = router;