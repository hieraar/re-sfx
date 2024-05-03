const jwt = require('jsonwebtoken');

const getUserIDByAuth = (token) => {
  let userId
  if (!token) {
    return undefined
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return undefined
    }
    userId = decoded
  })
  return userId._id
};

module.exports = { getUserIDByAuth };
