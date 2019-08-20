module.exports = fn => {
  // returns an anonymous function and express will call it as soon as e.g. we create a job wih the createJob() handler
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
