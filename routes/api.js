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

    // validation
    if(!userId){ return res.json({error: 'UserId not found'}) }
    if(!description){ return res.json({error: 'Description not found'}) }
    if(!duration){ return res.json({error: 'Duration not found'}) }
    if (/^\d{4}\-\d{2}\-\d{2}$/.test(date)){
      return res.json({error: 'invalid date format: yyyy-mm-dd'})
    }
      
    User.findById(userId, function(err, user){
      if(err) throw err;

        if (!user){
        return res.json({error: 'UserId not found'})
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
  
    User.findById(userId, function(err, user){
      if(err) throw err;
      
      if (!user){
        return res.json({error: 'UserId not found'})
      }
      
      Exercise.find({userId: userId}, function(error, exercises){
        if(error) throw error
        
        return res.json({
          _id:user._id, 
          username: user.username, 
          log: exercises.map(e=>(
            {description: e.description, 
             duration:e.duration,
             date:formatDate(e.date)}
          )), 
          count:exercises.length
        })
      })
    })
  })

function formatDate(date) {
  const MONTHS={
    0:"Jan",1:"Feb",2:"Mar",3:"Apr",5:"May",
    6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",
    
  }
  //Sun Mar 24 2019
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

module.exports = router