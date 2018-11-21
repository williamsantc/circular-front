const jwt = require('jsonwebtoken');

export const AuthMiddleware = (req, res, next) => {
  const user = {
    "email": 'william',
    "name": 'santos'
  };

  // do the database authentication here, with user name and password combination.
  const token = jwt.sign(user, 'qlqElmio', { expiresIn: 50000});
  const authHeader = req.headers.authorization
  // console.log('authHeader=' + authHeader);
  // console.log('token=' + token);
  next();
}