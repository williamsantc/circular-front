const jwt = require('jsonwebtoken');

const isEmpty = function (element) {
  return (element === undefined || element === null || (typeof element === 'string' && element.trim() === ''))
}

export const AuthMiddleware = (req, res, next) => {
  const user = {
    "email": 'william',
    "name": 'santos'
  };

  // do the database authentication here, with user name and password combination.
  const token = jwt.sign(user, 'qlqElmio', { expiresIn: 50000});
  const authHeader = req.headers.authorization
  if(isEmpty(authHeader)) {
    res.status(403).send('Acceso no autorizado')
    return
  }

  
  next();
}