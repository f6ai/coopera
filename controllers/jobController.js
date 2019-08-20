const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Job = require('./../models/jobModel');

// exports.getAllJobs = factory.getAll(Job);
// exports.getJob = factory.getOne(Job, { path: 'reviews' });
// exports.createJob = factory.createOne(Job);
// exports.updateJob = factory.updateOne(Job);
// exports.deleteJob = factory.deleteOne(Job);

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const jobs = await Job.find();
  res.status(200).json({
    status: 'success',
    data: {
      jobs
    }
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  // with populate we fill the referenced hosts into a job (do not show the __v property)
  const job = await Job.findById(req.params.id).populate({
    path: 'hosts',
    select: '-__v'
  });

  if (!job) {
    return next(new AppError('No job found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      job
    }
  });
});

exports.createJob = catchAsync(async (req, res, next) => {
  const newJob = await Job.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      job: newJob
    }
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!job) {
    return next(new AppError('No job found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      job
    }
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndDelete(req.params.id);

  if (!job) {
    return next(new AppError('No job found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: null
  });
});
