const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Assuming the token is stored in a cookie

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token verification failed' });
    }

    req.user = user; // Set the user object in the request for later use
    next();
  });
};

module.exports = { authenticateToken };
