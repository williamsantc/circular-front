const express = require('express');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
import { AuthMiddleware } from './AuthMiddleware'

// Require API routes
const indexRouter = require('./routes/index');
const areaRouter = require('./routes/area');

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

app.use(AuthMiddleware);

// Import API Routes
app.use('/', indexRouter);
app.use('/area', areaRouter);

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