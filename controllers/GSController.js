const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const LegacyGS = require('./../models/legacyGSModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const storage = multer.diskStorage({});

exports.upload = multer({ storage: storage });

exports.uploadPhoto = catchAsync(async (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

  const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
    folder: 'LegacyE-pass/LegacyGS/',
    public_id: `${req.body.name?.split(' ')[0]}-${Date.now()}`,
    format: 'jpeg',
    overwrite: true,
    transformation: [{ width: 500, height: 500, crop: 'limit', quality: 50 }]
  });

  req.photoData = uploadedFile;
  next();
});

exports.createIntern = catchAsync(async (req, res, next) => {
  // 1) Register Staff.
  const newIntern = await LegacyGS.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.photoData.secure_url,
    phoneNumber: req.body.phoneNumber,
    department: req.body.department,
    course: req.body.course
  });

  const intern = {
    name: newIntern.name,
    photo: newIntern.photo,
    passcode: newIntern.passcode,
    courses: newIntern.courses,
    department: newIntern.department
  };

  // 2) Send response.
  res.status(201).json({
    status: 'success',
    data: {
      intern
    }
  });
});

exports.getAllInterns = catchAsync(async (req, res, next) => {
  const interns = await LegacyGS.find({});

  res.status(200).json({
    status: 'success',
    results: interns.length,
    data: {
      interns
    }
  });
});

exports.getIntern = catchAsync(async (req, res, next) => {
  const intern = await LegacyGS.findById(req.params.id);

  if (!intern) {
    return next(new AppError(`No document found with that ID found`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      intern
    }
  });
});

exports.updateInternInfo = catchAsync(async (req, res, next) => {
  //Execute query and run mongo validators
  const updatedIntern = await LegacyGS.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  //Send reponse
  res.status(200).json({
    status: 'success',
    data: {
      intern: updatedIntern
    }
  });
});

exports.deleteIntern = catchAsync(async (req, res, next) => {
  const deletedIntern = await LegacyGS.findByIdAndDelete(req.params.id);

  // Checks if deletedQuestion document is empty
  if (!deletedIntern) {
    return next(new AppError(`No document found with that ID`, 404));
  }

  //Send reponse
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.verifyGSStaff = catchAsync(async (req, res, next) => {
  const { passcode } = req.body;

  if (!passcode) {
    return next(
      new AppError('Verification failed: provide valid passcode.', 400)
    );
  }

  const user = await LegacyGS.findOne({ passcode: req.body.passcode });
  if (!user || !user.correctPasscode(passcode, user.passcode)) {
    return next(new AppError('Verification failed: Invalid passcode.', 401));
  }

  user.verifyStaff();
  user.save();

  res.status(200).json({
    status: 'success',
    message: 'Verification complete.',
    data: {
      staff: user
    }
  });
});
