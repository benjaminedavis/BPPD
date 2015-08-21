var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

var User = require('../models/user');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/addsong/:songId', function(req, res, next){
  User.findOne({_id: req.decoded.id}, function(err, user){
    var songId = req.params.songId;
    console.log(user.songs);
    if(user.songs.filter(function(value){ return value == songId}).length == 0){
      console.log(songId + ' has been added to your playlist')
      user.songs.push(songId);
      user.save();
      res.send({
        results: true,
        songs: user.songs});

    }else{
      user.songs.splice(user.songs.indexOf(songId), 1);
      console.log('Song ' + songId + ' has been deleted');
      user.save();
      res.send({
        results: false,
        songs: user.songs});
    }
  });
});

router.get('/delete', function(req, res, next) {
  if (req.token) {
    res.render('../views/delete', {title: 'Delete User Account', token: req.decoded, userId: req.decoded.id});
  }else {
    console.log('You are not authorized');
    res.redirect('/');
  }
});

router.get('/edit', function(req, res, next) {
  User.findOne({_id: req.decoded.id}, function(err, user){
    if(err) {
      console.log(err);
    } else {
    res.render('edit.ejs', {title: 'Your Saved Music', token: req.decoded, songs: user.songs, userName: user.name, userEmail: user.email});
    };
  });
});

router.delete('/delete/confirm', function(req, res){
  User.findOneAndRemove({_id: req.body.id}, function(err, user){
    if(err) return console.log(err);
    console.log(user);
    res.clearCookie('token');
    res.redirect('/');
  });
});

router.post('/new/account', function(req, res){
  var user = new User(req.body);
  user.save(function(err){
    if(err){
      return res.status(401).send({message: err.errmsg});
    }else{
      res.redirect('/');
    }
  });
});

router.get('/:id', function(req, res, next) {
  var isLoggedIn;
  if(req.token) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }
  User.findOne({_id: req.params.id}, function(err, user){
    if(err) {
      console.log(err);
    } else {
    res.render('show.ejs', {title: 'Your Saved Music',isLoggedIn: isLoggedIn, token: req.decoded, songs: user.songs, userId: req.decoded.id});
    }
  });
});

router.post('/edit', function(req,res) {
  User.findOne({_id: req.decoded.id}).select('name email password').exec(function(err, user){
    if(err) return console.log(err);
    user.name = req.body.name;
    user.email = req.body.email;
    if(!user.authenticate(req.body.password) && req.body.password != '') {
      user.password = req.body.password;
    }
    user.save();
    res.redirect('/users/' + req.decoded.id);
  })

})

module.exports = router;