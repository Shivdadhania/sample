const express = require('express');
const Customer = require('../models/customer');
const { body } = require('express-validator/check');

const customerController = require('../controllers/customer');

const router = express.Router();

router.post('/create-customer', [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return Customer.findOne({ email: value }).then(userDoc => {
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

  ],customerController.addCustomer);

router.get('/products/:customerId',customerController.getProducts);

router.post('/orders/:customerId',customerController.orders);

router.get('/view-orders/:customerId',customerController.viewOrders);

module.exports = router;