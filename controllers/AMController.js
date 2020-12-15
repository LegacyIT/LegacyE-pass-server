const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const LegacyAM = require('./../models/legacyAMModel');
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
    folder: 'LegacyE-pass/LegacyAM/',
    public_id: `${req.body.name.split(' ')[0]}-${Date.now()}`,
    format: 'jpeg',
    overwrite: true,
    transformation: [{ width: 500, height: 500, crop: 'limit', quality: 50 }]
  });

  req.photoData = uploadedFile;
  next();
});

exports.createAMStaff = catchAsync(async (req, res, next) => {
  // 1) Register Staff.
  const newAMStaff = await LegacyAM.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.photoData.secure_url,
    phoneNumber: req.body.phoneNumber,
    department: req.body.department,
    position: req.body.position,
    designation: req.body.designation
  });

  const staff = {
    name: newAMStaff.name,
    photo: newAMStaff.photo,
    passcode: newAMStaff.passcode,
    department: newAMStaff.department,
    position: newAMStaff.position,
    designation: newAMStaff.designation
  };

  // 2) Send response.
  res.status(201).json({
    status: 'success',
    data: {
      staff
    }
  });
});

exports.getAllAMStaff = catchAsync(async (req, res, next) => {
  const staff = await LegacyAM.find({});

  res.status(200).json({
    status: 'success',
    results: staff.length,
    data: {
      staff
    }
  });
});

exports.getAMStaff = catchAsync(async (req, res, next) => {
  const staff = await LegacyAM.findById(req.params.id);

  if (!staff) {
    return next(new AppError(`No document found with that ID found`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      staff
    }
  });
});

exports.updateAMStaffInfo = catchAsync(async (req, res, next) => {
  //Execute query and run mongo validators
  const updatedStaff = await LegacyAM.findByIdAndUpdate(
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
      staff: updatedStaff
    }
  });
});

exports.deleteAMStaff = catchAsync(async (req, res, next) => {
  const deletedStaff = await LegacyAM.findByIdAndDelete(req.params.id);

  // Checks if deletedQuestion document is empty
  if (!deletedStaff) {
    return next(new AppError(`No document found with that ID`, 404));
  }

  //Send reponse
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.verifyAMStaff = catchAsync(async (req, res, next) => {
  const { passcode } = req.body;

  if (!passcode) {
    return next(
      new AppError('Verification failed: provide valid passcode.', 400)
    );
  }

  const user = await LegacyAM.findOne({ passcode: req.body.passcode });
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
