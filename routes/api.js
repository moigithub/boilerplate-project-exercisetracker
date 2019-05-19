'use strict';
const express = require('express')
const mongoose = require('mongoose');

const User = require('../models/user')
const Exercise = require('../models/exercise')

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
    const {userId, description, duration, date} = req.body

    User.findById(userId, function(err, user){
      if(err) throw err;
      
      if (!user){
        return res.json({error: 'UserId not found'})
      }
      
      // validation
      if (/^\d{4}\-\d{2}\-\d{2}$/.test(date)){
        return res.json({error: 'invalid date format:'})
      }
      
      Exercise.create({
        userId: userId, 
        description: description,
        duration: duration,
        date: new Date(date+"00:00:00")  || new Date()
        }, function(err, newExercise){
        
          if(err) throw err;

          return res.json(newExercise)
      })
    })
  })
  .get('/log',function(req,res){
    /*
I can retrieve a full exercise log of any user by getting 
/api/exercise/log with a parameter of userId(_id). 
Return will be the user object with added array log and count (total exercise count).
*/
    const {userId, from, to, limit} = req.query
    console.log("uid", userId, "from", from, "to", to, "limit", limit)
  
    User.findById(mongoose.ObjectId(userId), function(err, user){
      if(err) throw err;
      
      if (!user){
        return res.json({error: 'UserId not found'})
      }
      
      Exercise.find({userId: mongoose.ObjectId(userId)}, function(error, exercises){
        if(error) throw error
        
        return res.json({user:user, exercises: exercises, count:1})
      })
    })
  })


module.exports = router