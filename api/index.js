const express = require('express');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
import { AuthMiddleware } from './AuthMiddleware'

// Require API routes
const areaRouter = require('./routes/area');
const entidadRouter = require('./routes/entidad');
const responsableRouter = require('./routes/responsable');
const circularRouter = require('./routes/circular');
const almaMultiRouter = require('./routes/almacenar_multipart');
const almaPLainRouter = require('./routes/almacenar_plain');

// Create express instnace
const app = express()

// enable CORS
app.use(cors());
app.options('*', cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Import API Routes, las rutas que requieren verifiacion de token, se envía el middleware
app.use('/area', AuthMiddleware, areaRouter);
app.use('/entidad', AuthMiddleware, entidadRouter);
app.use('/responsable', AuthMiddleware, responsableRouter);
app.use('/circular', AuthMiddleware, circularRouter);
app.use('/almacenar_multi', AuthMiddleware, almaMultiRouter);
app.use('/almacenar_plain', AuthMiddleware, almaPLainRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}