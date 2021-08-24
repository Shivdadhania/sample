const express = require('express');
const Customer = require('../models/customer');
const { body } = require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Minimum length of password must be 5')

], authController.login);

module.exports = router;