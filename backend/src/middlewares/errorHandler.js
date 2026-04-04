export default function errorHandler(err, req, res, next) {
  console.log(err);

  // Erreurs Mongoose fréquentes (simple)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: {
        message: err.message,
      },
    });
  }

  return res.status(500).json({
    error: {
      message: "Internal Server Error",
    },
  });
}
