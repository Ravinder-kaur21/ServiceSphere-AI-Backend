export function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.message) {
    return res.status(400).json({ success: false, message: error.message });
  }

  return res.status(500).json({ success: false, message: 'Internal server error' });
}
