const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const jobRouter = require('./routes/jobRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

// set the template engine
app.set('view engine', 'pug');
// tell where the templates located
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES
// serve the static html files -> we set the route to it
app.use(express.static(path.join(__dirname, 'public')));

// set security HTTP headers
app.use(helmet());

// morgan is for logging the requests, time, etc.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// set rate limiter -> prevent attacks by superfluous requests (DoS)
// if app crashes, resets the limit counter to 0!!!
const limiter = rateLimit({
  // how many we allow
  max: 100,
  // in what time period
  windowMs: 60 * 60 * 1000,
  message: 'Too many request form this IP, please try again in an hour!'
});
app.use('/api', limiter);

// use body parser -> reading data form body into req.body
app.use(express.json({ limit: '10kb' }));

// use cookie parser -> it makes available on the req object
app.use(cookieParser());

// data sanitization against NoSQL query injection (filters out $ and . -> that's how mongoDB operators are used)
app.use(mongoSanitize());

// data sanitization against XSS (filters out malicious html with JS code)
app.use(xss());

// prevent parameter pollution (clears up queryString) --- note: sorting, filtering not yet implemented but maybe in the future | we can whitelist some parameters too
app.use(hpp());

// ROUTES
// where to render the pug templates
app.use('/', viewRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/users', userRouter);

// create operational error for unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find the URL: ${req.originalUrl} on this server.`));
});

// global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
