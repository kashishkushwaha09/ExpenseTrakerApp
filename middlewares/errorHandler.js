module.exports= (err, req, res, next) => {
  const statusCode = err.statusCode;
  const message = err.message;

  res.status(statusCode).json({
    success: false,
    message,
  });

console.error('internal error', err);
 
}