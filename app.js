const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

//ERROR HANDLERS
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// ROUTER
const AMRouter = require('./routes/AMRoutes');
const CRRouter = require('./routes/CRRoutes');
const ITRouter = require('./routes/ITRoutes');
const GSRouter = require('./routes/GSRoutes');

const app = express();

// 1) GLOBAL Middlewares
app.use(cors());
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize({ replaceWith: '_' }));

// Data sanitization aginst xss
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'question',
      'options',
      'answer',
      'level',
      'subject',
      'topic',
      'explanation'
    ]
  })
);

// Limit requests from same IP
const limiter = rateLimit({
  max: 50,
  windowMs: 30 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Serving static files
// app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// ROUTES
app.use('/api/v1/legacyAM', AMRouter);
app.use('/api/v1/legacyCR', CRRouter);
app.use('/api/v1/legacyIT', ITRouter);
app.use('/api/v1/legacyGS', GSRouter);

//ERROR HANDLER: for all unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// global error handling midlleware
app.use(globalErrorHandler);

module.exports = app;
