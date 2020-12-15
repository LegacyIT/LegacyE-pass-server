const express = require('express');
const GSController = require('./../controllers/GSController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(
    GSController.upload.single('photo'),
    authController.authenticateGSInterns,
    GSController.uploadPhoto,
    GSController.createIntern
  )
  .get(GSController.getAllInterns);

router
  .route('/:id')
  .patch(GSController.updateInternInfo)
  .get(GSController.getIntern)
  .delete(GSController.deleteIntern);

module.exports = router;
