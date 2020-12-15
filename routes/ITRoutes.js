const express = require('express');
const ITController = require('./../controllers/ITController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(
    ITController.upload.single('photo'),
    authController.authenticateITStaff,
    ITController.uploadPhoto,
    ITController.createITStaff
  )
  .get(ITController.getAllITStaff);

router
  .route('/:id')
  .patch(ITController.updateITStaffInfo)
  .get(ITController.getITStaff)
  .delete(ITController.deleteITStaff);

module.exports = router;
