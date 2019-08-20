const express = require('express');
const jobController = require('./../controllers/jobController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(jobController.getAllJobs)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'host'),
    jobController.createJob
  );

router
  .route('/:id')
  .get(jobController.getJob)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'host'),
    jobController.updateJob
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    jobController.deleteJob
  );

module.exports = router;
