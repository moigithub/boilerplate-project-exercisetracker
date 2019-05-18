'use strict';
const express = require('express')
const mongoose = require('mongoose');

const User = require('../models/user')

const router = express.Router()

router
  .get('/new-user',function (req, res){
    console.log(req.body)

  //console.log(toString);
    res.json({aa:"asdf"});
  });

module.exports = router