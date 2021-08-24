const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator/check');
const Product = require('../models/product');
const Owner = require('../models/owner');
const Customer = require('../models/customer');


exports.login = (req, res, next) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  Customer.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
     res.status(200).json({ message : 'login successfully!'});
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};