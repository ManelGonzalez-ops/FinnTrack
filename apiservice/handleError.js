class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, res) => {
  //destructuing default value only works when key is undefined.
  let { statusCode = 500, message } = err;

  //we need to avoid statusCode when it's null
  
  console.log(statusCode, message, "errorse");
  return res.status(statusCode).send({
    status: "error",
    statusCode,
    message
  });
};

module.exports = {
  ErrorHandler,
  handleError
}