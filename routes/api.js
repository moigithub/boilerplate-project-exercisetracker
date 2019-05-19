'use strict';
const express = require('express')
const mongoose = require('mongoose');

const User = require('../models/user')

const router = express.Router()

router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

router
  .post('/new-user',function (req, res){
    console.log("dsdf",req.body)
    User.find({username: req.body.username}, function(err, user){
      if(err) throw err;

      if(user){
        return res.json({user: user})
      }
      
      User.create({username: req.body.username}, function (err, newuser) {
        if (err) throw err
        // saved!
        return res.json({ok:true, user:newuser})
      })
    })
    //console.log(toString);
    res.json({aa:"asdf"});
  });

module.exports = router