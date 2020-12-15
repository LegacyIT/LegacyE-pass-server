const express = require('express');
const AMController = require('./../controllers/AMController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(
    AMController.upload.single('photo'),
    authController.authenticateAMStaff,
    AMController.uploadPhoto,
    AMController.createAMStaff
  )
  .get(AMController.getAllAMStaff);

router
  .route('/:id')
  .patch(AMController.updateAMStaffInfo)
  .get(AMController.getAMStaff)
  .delete(AMController.deleteAMStaff);

module.exports = router;
