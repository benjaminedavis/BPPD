var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* sends user to delete confirmation page */
router.get('/delete', function(req, res, next) {
  if (req.token) {
    res.render('../views/delete');
  }else {
    console.log('You are not authorized');
    res.redirect('/');
  }
  // res.send('confirm delete page')
});

router.delete('/delete/confirm', function(req, res){
  User.findOne({_id: req.body.id}, function(err, user){
    if(err) {
      console.log(err);
      res.json({'message': "error: could not delete user"})
      return
    } else {
      console.log(user);
      user.remove();
      // res.json({'message': 'deleted user:'+ req.body.id});
      res.render('/');
    };
  });
});

module.exports = router;
