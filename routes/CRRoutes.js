const express = require('express');
const CRController = require('./../controllers/CRController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(
    CRController.upload.single('photo'),
    authController.authenticateCRStaff,
    CRController.uploadPhoto,
    CRController.createCRStaff
  )
  .get(CRController.getAllCRStaff);

router
  .route('/:id')
  .patch(CRController.updateCRStaffInfo)
  .get(CRController.getCRStaff)
  .delete(CRController.deleteCRStaff);

module.exports = router;
