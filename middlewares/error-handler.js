const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error(err);

  // Check if error has a status code
  const statusCode = err.statusCode || 500;
  const message = err.message || "An error occurred on the server";

  // Send response to client
  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
