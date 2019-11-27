const jwt = require('jsonwebtoken')

import authSettings from './authSettings'

const isEmpty = function(element) {
  return (
    element === undefined ||
    element === null ||
    (typeof element === 'string' && element.trim() === '')
  )
}

export const AuthMiddleware = (req, res, next) => {
  let authHeader = req.headers.authorization
  if (isEmpty(authHeader)) {
    return res.status(403).send({
      error: true,
      message: 'No token provided.'
    })
  }

  authHeader = authHeader.replace('Bearer ', '').trim()

  let dateSign =
    authSettings.sign +
    new Date().getDate() +
    (new Date().getMonth() + 1) +
    new Date().getFullYear()

  // verifies secret and checks exp
  jwt.verify(authHeader, dateSign, function(err, decoded) {
    if (err) {
      console.error(err.name)
    }

    if (err && err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .send({ error: true, message: 'Unauthorized access.' })
    } else if (err) {
      return res.status(403).send({ error: true, message: 'Invalid token.' })
    }
    req.decoded = decoded
    // res.set('custom-header', 'hi-there')

    next()
  })
}
