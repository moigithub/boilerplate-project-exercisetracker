'use strict';
import express from 'express'
const router = express.Router()

router
  .get('/exercise/new-user',function (req, res){
    var input = req.query.input;

  //console.log(toString);
    res.json(toString);
  });

module.exports = router