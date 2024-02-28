const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login/Admin', userController.loginAdmin);
router.post('/login/users', userController.userLogin);
router.get('/profile', authMiddleware, userController.getUserProfile);
router.get('/getAllUsers',userController.getAllUsers )
router.put("/updateUser", userController.updateUser)
module.exports = router;
