/**
 * Centralized Error Handling Middleware
 */
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[Error] ${req.method} ${req.url} - ${message}`);

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    // Only show stack trace in development mode if needed
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorMiddleware;
