var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* DELETE individual user. */
router.get('/delete', function(req, res, next) {
  res.render('../views/delete');
});


// bens new stuff

// CREATE a new user. just created */
// we need a new.ejs
router.post('/new', function(req, res, next) {
  res.send('successful /new test')
  // res.render('../views/new');
});

// GET a user's page. this is where saved music is kept
// we need a show.ejs
router.get('/:id', function(req, res, next) {
  res.send('successful /:id test')
  // res.render('../views/show');
});

// EDIT a user's page. to add/delete music
router.put('/:id/edit', function(req, res, next) {
  res.send('successful :id/edit test')
  // res.render('../views/show');
})

// bens new stuff


module.exports = router;
