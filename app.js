const express = require('express');
const bodyParser = require('body-parser');
const { body } = require('express-validator/check');

const mongoose = require('mongoose');


const ownerRoutes = require('./routes/owner');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');


const app = express();

app.use(bodyParser.json()); 



app.use('/owner', ownerRoutes);

app.use('/auth', authRoutes);

app.use('/customer',customerRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    //You need to past you URL here 
    'URL'
  )
  .then(result => {
    console.log('connected');
    app.listen(3000);
  })
  .catch(err => console.log(err));

