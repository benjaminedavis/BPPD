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
  res.render('../views/delete');
  // res.send('confirm delete page')
});


// bens new stuff

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

// // CREATE a new user. just created */
// // we also need a new.ejs
// router.post('/new', function(req, res, next) {
//   res.send('successful /new test')
//   // res.render('../views/new');
// });
//
// // GET a user's page. this is where saved music is kept
// // we need a show.ejs
// router.get('/:id', function(req, res, next) {
//   res.send('successful /:id test')
//   // res.render('../views/show');
// });
//
// // EDIT a user's page. to add/delete music
// router.put('/:id/edit', function(req, res, next) {
//   res.send('successful :id/edit test')
//   // res.render('../views/show');
// })

// bens new stuff


module.exports = router;
