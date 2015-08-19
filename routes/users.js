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
    res.render('../views/delete', {userId: req.decoded.id});
  }else {
    console.log('You are not authorized');
    res.redirect('/');
  }
  // res.send('confirm delete page')
});
/* NEW users listing. */
router.get('/new', function(req, res, next) {
  res.render('new.ejs');
});


/* EDIT users info. */
router.get('/edit', function(req, res, next) {
  res.render('edit.ejs');
});
router.delete('/delete/confirm', function(req, res){
  User.findOneAndRemove({_id: req.body.id}, function(err, user){
    if(err) return console.log(err);
    console.log(user);
    res.clearCookie('token');
    res.redirect('/');
  })
});

module.exports = router;
