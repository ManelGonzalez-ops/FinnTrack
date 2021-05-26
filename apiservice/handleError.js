class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, res) => {
  const { statusCode = 500, message } = err;
  console.log(statusCode,message, "errorse");
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message
  });
};

module.exports = {
  ErrorHandler,
  handleError
}