const { ITStaff, AMStaff, CRStaff, GSInterns } = require('./../utils/users');
const LegacyAM = require('./../models/legacyAMModel');
const LegacyCR = require('./../models/legacyCRModel');
const LegacyIT = require('./../models/legacyITModel');
const LegacyGS = require('./../models/legacyGSModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.authenticateAMStaff = catchAsync(async (req, res, next) => {
  if (!req.body.phoneNumber || !req.body.department) {
    return next(
      new AppError(
        'Authentication failed: Please provide valid input data.',
        400
      )
    );
  }

  if (req.body.department !== 'LegacyAM') {
    return next(
      new AppError('Authentication failed: Invalid input data.', 400)
    );
  }

  if (!AMStaff.includes(req.body.phoneNumber)) {
    return next(
      new AppError(
        'Authentication failed: User with this number not found.',
        401
      )
    );
  }

  const user = await LegacyAM.findOne({ phoneNumber: req.body.phoneNumber });
  if (user) {
    return next(
      new AppError('Authentication failed: User already exsits.', 409)
    );
  }

  next();
});

exports.authenticateITStaff = catchAsync(async (req, res, next) => {
  if (!req.body.phoneNumber || !req.body.department) {
    return next(
      new AppError(
        'Authentication failed: Please provide valid input data.',
        400
      )
    );
  }

  if (req.body.department !== 'LegacyIT') {
    return next(
      new AppError('Authentication failed: Invalid input data.', 400)
    );
  }

  if (!ITStaff.includes(req.body.phoneNumber)) {
    return next(
      new AppError(
        'Authentication failed: User with this number not found.',
        401
      )
    );
  }

  const user = await LegacyIT.findOne({ phoneNumber: req.body.phoneNumber });
  if (user) {
    return next(
      new AppError('Authentication failed: User already exsits.', 409)
    );
  }

  next();
});

exports.authenticateCRStaff = catchAsync(async (req, res, next) => {
  if (!req.body.phoneNumber || !req.body.department) {
    return next(
      new AppError(
        'Authentication failed: Please provide valid input data.',
        400
      )
    );
  }

  if (req.body.department !== 'LegacyCR') {
    return next(
      new AppError('Authentication failed: Invalid input data.', 400)
    );
  }

  if (!CRStaff.includes(req.body.phoneNumber)) {
    return next(
      new AppError(
        'Authentication failed: User with this number not found.',
        401
      )
    );
  }

  const user = await LegacyCR.findOne({ phoneNumber: req.body.phoneNumber });
  if (user) {
    return next(
      new AppError('Authentication failed: User already exsits.', 409)
    );
  }

  next();
});

exports.authenticateGSInterns = catchAsync(async (req, res, next) => {
  if (!req.body.phoneNumber || !req.body.department) {
    return next(
      new AppError(
        'Authentication failed: Please provide valid input data.',
        400
      )
    );
  }

  if (req.body.department !== 'LegacyGS') {
    return next(
      new AppError('Authentication failed: Invalid input data.', 400)
    );
  }

  if (!GSInterns.includes(req.body.phoneNumber)) {
    return next(
      new AppError(
        'Authentication failed: User with this number not found.',
        401
      )
    );
  }

  const user = await LegacyGS.findOne({ phoneNumber: req.body.phoneNumber });
  if (user) {
    return next(
      new AppError('Authentication failed: User already exsits.', 409)
    );
  }

  next();
});
