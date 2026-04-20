function errorHandler(error, _req, res, _next) {
  console.error(error);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } });
}

module.exports = errorHandler;
