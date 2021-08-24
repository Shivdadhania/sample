const Product = require('../models/product');
const Owner = require('../models/owner');
const Customer = require('../models/customer');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const Order = require('../models/orders');
const mongoose = require('mongoose');



exports.addCustomer = (req , res , next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
  
    const { email , password ,name } = req.body;

             bcrypt
            .hash(password, 12)
            .then(hashedPw => {
                const customer = new Customer({
                    email : email,
                    password : hashedPw,
                    name:name
                });
             return customer.save();
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

exports.getProducts = (req , res , next) =>{
    const customerId = req.params.customerId;

    Customer.findById(customerId)
    .then(result =>{
        if(result){
           return Product.find()
            .then(prod =>{
                res.json({ products : prod });
            })
        }
        else{
            res.json({
                message: "Customer does not exists"
            })
        }
    })
    .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });

},

exports.orders = (req , res , next) =>{
    const orders = req.body.orders;
    const ord = req.body.list.orders.map(i=>{
        let prodId = mongoose.Types.ObjectId(i.id);
      return {  product: prodId , quantity: i.qty };  
  });
    let customer;
    Customer.findById(req.params.customerId)
    .then(res =>{
        customer = res; 
        res.cart.items = ord;
        console.log(res.cart.items);
        res.save();
        return res;
    })
    .then(res =>{
        return res
        .populate('cart.items.product')
        .execPopulate()
        .then(user => {
          
          const totalOrder = user.cart.items;
        console.log(totalOrder);
        return totalOrder;
    })
    .then(re =>{
        const order = new Order({
            user: {
              email: customer.email,
              userId: customer._id
            },
            products: re
          });
          return order.save();
          
        })
    .catch(err => console.log(err)); 
   })
   .then(res =>{
       Customer.findById(req.params.customerId)
       .then(result =>{
           result.cart.items = null;
           return result.save();
           
       });

   })
   .catch(err => console.log(err));
},

exports.viewOrders = (req , res , next)=>{
    customerId = req.params.customerId;
    Order.find({ 'user.userId' : customerId})
    .then(result =>{
        res.json({ orders : result });
    })
    .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
}

