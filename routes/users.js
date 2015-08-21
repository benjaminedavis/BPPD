var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Add songs route
router.get('/addsong/:songId', function(req, res, next){
  User.findOne({_id: req.decoded.id}, function(err, user){
    var songId = req.params.songId;
    console.log(user.songs);
    //To check if song is already added
    if(user.songs.filter(function(value){ return value == songId}).length == 0){
      console.log(songId + ' has been added to your playlist')
      user.songs.push(songId);
      user.save();
      res.send({
        results: true,
        songs: user.songs});

    }else{
      //If song is already in songs list, delete
      user.songs.splice(user.songs.indexOf(songId), 1);
      console.log('Song ' + songId + ' has been deleted');
      user.save();
      res.send({
        results: false,
        songs: user.songs});

    }
  });
});

/* sends user to delete confirmation page */
router.get('/delete', function(req, res, next) {
  if (req.token) {
    res.render('../views/delete', {title: 'Delete User Account', token: req.decoded, userId: req.decoded.id});
  }else {
    console.log('You are not authorized');
    res.redirect('/');
  }
  // res.send('confirm delete page')
});

/* EDIT users info. */
router.get('/edit', function(req, res, next) {
  User.findOne({_id: req.decoded.id}, function(err, user){
     //? should it be req.decoded.id
    if(err) {
      console.log(err);
    } else {
      //
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
// POST create new user on the database
router.post('/new/account', function(req, res){
  //create a new instance of the user model, saved onto database
  // uses the user model schema to create new instance
  var user = new User(req.body);
  //save the user
  user.save(function(err){
    if(err){
      // error message
      return res.status(401).send({message: err.errmsg});
    }else{
      //return res.status(200).send({message: 'user created!'});
      res.redirect('/');
    }
  });
});

// SHOW user's saved music
router.get('/:id', function(req, res, next) {
  User.findOne({_id: req.params.id}, function(err, user){
     //? should it be req.decoded.id
    if(err) {
      console.log(err);
    } else {
    res.render('show.ejs', {title: 'Your Saved Music', token: req.decoded, songs: user.songs, userId: req.decoded.id});
    //? should it be ('../views/show',
    //? should it be       {title: user.name, songsList: user.songs, userName: user.name});
    }
  });
});

router.post('/edit', function(req,res) {
  //console.log(req.body);
  User.findOne({_id: req.decoded.id}).select('name email password').exec(function(err, user){
    if(err) return console.log(err);
    user.name = req.body.name;
    user.email = req.body.email;
    if(!user.authenticate(req.body.password) && req.body.password != '') {
      user.password = req.body.password;
    }
    user.save();
    res.render('show', {title: 'Your Saved Music', token: req.token, songs: user.songs, userId: req.decoded.id});
  })

})

module.exports = router;