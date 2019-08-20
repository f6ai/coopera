class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // constructor function call will not pollute the error stack
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
