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

    res.render('../views/show', {title: user.name, songsList: user.songs, userName: user.name})
  })
})*/

//Add songs route
router.put('/addsong', function(req, res, next){
  User.findOne({_id: req.decoded.id}, function(err, user){
    var songId = req.body.songId;
    console.log('Adding song:' + songId);
    //To check if song is already added
    if(user.songs.filter(function(value){ return value == songId}).length == 0){
      console.log(songId + ' has been added to your playlist')
      user.songs.push(songId);
      user.save();
      next();
    }else{
      //If song is already in songs list, delete
      user.songs.splice(user.songs.indexOf(songId), 1);
      console.log('Song ' + songId + ' has been deleted');
      user.save();
      next();
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
/* NEW users listing. */
router.get('/new', function(req, res, next) {
  res.render('new', {title: 'Create New Account', token: req.token, });
});


/* EDIT users info. */
router.get('/edit', function(req, res, next) {
  // commenting out the token while I'm working on the edit ejs view
  // if(req.token){
    res.render('edit', {title: 'Edit Profile', token: req.token});
  // }
  // else {
  //   res.redirect('/');
  // }
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
      //return res.status(200).send({message: 'user created!'});
      res.redirect('/');
    }
  });
});

module.exports = router;
