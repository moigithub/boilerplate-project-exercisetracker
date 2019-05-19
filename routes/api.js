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
  .get('/users', function(req,res){
    User.find({}, function(err, users){
      if(err) throw err;
      
      res.json(users)
    })
  })
  .post('/new-user',function (req, res){
    console.log("dsdf",req.body)
    User.findOne({username: req.body.username}, function(err, user){
      if(err) throw err;

      if(user){
        return res.json({user: 'already exist'})
      }

      User.create({username: req.body.username}, function (error, newuser) {
        if (err) throw err
        // saved!
        return res.json({_id:newuser._id, username:newuser.username})
      })
    })
  })
  .post('/add',function(req,res){
  /*I can add an exercise to any user by posting form data 
  userId(_id), description, duration, and optionally date 
  to /api/exercise/add. 
  If no date supplied it will use current date. 
  Returned will the the user object with also with the exercise fields added.
  */
    const id = req.body.userId,
          description = req.body.description,
          duration = req.body.duration,
          date = req.body.date || new Date()

    User.create({}, function(err,newUser){
      if(err) throw err;
      
      res.json(newUser)
    })
  })
;

module.exports = router