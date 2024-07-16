import { ErrorRequestHandler } from "express"

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    res.status(400).json({ error: err.message });
  }
  else if (err.name === "JsonWebTokenError") {
    res.status(401).json({ error: "Invalid token" });
  }

  else if (err.name === "TokenExpiredError") {
    res.status(401).json({ error: "Token expired" });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default errorHandler
