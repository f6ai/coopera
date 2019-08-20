const mongoose = require('mongoose');
const slugify = require('slugify');
//const User = require('./userModel');

const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A job must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A job name must have less or equal then 40 characters'],
    minlength: [10, 'A job name must have more or equal then 10 characters']
  },
  slug: String,
  location: {
    // using GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    // first latitude second longitude
    coordinates: [Number],
    description: String,
    country: String
  },
  imageCover: String,
  summary: {
    type: String,
    required: [true, 'A job must have a summary']
  },
  description: String,
  typeOfHelp: String,
  learningOpp: String,
  accomodation: String,
  moreInfo: [String],
  spokenLangs: [String],
  availability: {
    startDate: Date,
    endDate: Date
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  maxGroupSize: Number,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  hosts: [
    {
      // host will be referenced to the job with ObjectId
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
});

// document middleware (runs before save() and create())
jobSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
