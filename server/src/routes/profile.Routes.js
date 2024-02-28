const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/getprofile/:id', profileController.getProfileById);
router.post('/createProfile', profileController.createProfile);
router.post('/update/:id', profileController.updateProfile);

module.exports = router;
