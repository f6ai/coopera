const Job = require('../models/jobModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getMainPage = catchAsync(async (req, res, next) => {
  res.status(200).render('main', {
    title: 'Volunteer sustainably'
  });
});

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. Get tour data from collection
  const jobs = await Job.find();

  // 2. Build template
  // 3. Render that template using tour data from 1.
  res.status(200).render('overview', {
    title: 'All Jobs',
    jobs
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  // 1. Get the data, for the requested job
  const job = await Job.findOne({ slug: req.params.slug });
  if (!job) {
    return next(new AppError('There is no job with that name.', 404));
  }
  // 2. Build template
  // 3. Render template using data from 1.
  res.status(200).render('job', {
    title: `${job.name}`,
    job
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};
