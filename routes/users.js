var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Show user's songs route
/*router.get('/:id', function(req, res){
  User.findOne({_id: req.decoded.id}, function(err, user){
    if(err) return console.log(err);

    res.render('../views/show', {songsList: user.songs, userName: user.name})
  })
})*/

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
  });
});
// POST create new user on the database
router.post('/new', function(req, res){
  //create a new instance of the user model, saved onto database
  // uses the user model schema to create new instance
  var user = new User(req.body);
  //save the user
  user.save(function(err){
    if(err){
      // error message
      return res.status(401).send({message: err.errmsg});
    }else{
      return res.status(200).send({message: 'user created!'});
    }
  });
});

module.exports = router;
