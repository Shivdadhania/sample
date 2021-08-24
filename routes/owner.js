const express = require('express');
const Owner = require('../models/owner');
const { body } = require('express-validator/check');
const productController = require('../controllers/owner');

const router = express.Router();


router.post('/create-owner', [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return Owner.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Minimum length of password must be 5')

  ],productController.createOwner);

router.post('/add-product/:ownerId',productController.addProduct);

router.get('/view-all-orders/:ownerId',productController.viewAllOrders);

module.exports = router;