const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('../models/product');
const Owner = require('../models/owner');
const Customer = require('../models/customer');
const { validationResult } = require('express-validator/check');
const Order = require('../models/orders');


exports.createOwner = (req , res ,next) =>{
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
  
    const { email , password , name} = req.body;
        
             bcrypt
            .hash(password, 12)
            .then(hashedPw => {
                const owner = new Owner({
                    email : email,
                    password : hashedPw,
                    name:name
                });
             return owner.save();
            })
             .then(result => {
                res.status(201).json({ message: 'Signup successfully!'});
              })
              .catch(err => {
                if (!err.statusCode) {
                  err.statusCode = 500;
                }
                next(err);
              });
},

exports.addProduct = (req , res , next) =>{
    const ownerId = req.params.ownerId;
    const { title , price , description } = req.body;

    Owner.findById(ownerId)
    .then(result =>{
        if(result){
           const product = new Product({
             title : title,
             price : price,
             description : description
           });

           console.log(product._id);
            product.save();
           return res.json({
            message: "Product Added!"
          });
        }
        else{
            return res.json({
                message: "Owner not found!!"
              });
        }
    }).catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });


},

exports.viewAllOrders = (req , res , next)=>{
    ownerId = req.params.ownerId;
    Owner.findById(ownerId)
    .then(result =>{
        if(result){
            Order.find()
            .then(data =>{
                return res.json({ orders : data});
            })
            .catch(err => console.log(err));
        }
        else{
            return res.json({ message: 'Owner does not exists'});
        }
    })
    .catch(err => console.log(err));
}

