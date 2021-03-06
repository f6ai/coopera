const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsController.getMainPage);
router.get('/jobs', viewsController.getOverview);
router.get('/job/:slug', viewsController.getJob);
router.get('/login', viewsController.getLoginForm);

module.exports = router;
