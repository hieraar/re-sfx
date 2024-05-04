const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  let token = req?.headers?.['authorization']?.split(' ')?.[1]
  console.log(token)
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({
        message: err.message,
      })
    }
    req.userId = decoded._id
    next()
  })
};

module.exports = { authenticateToken };
