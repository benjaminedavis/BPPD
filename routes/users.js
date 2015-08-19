var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* DELETE individual user. */
router.get('/delete', function(req, res, next) {
  if (req.token) {
    res.render('../views/delete');
  }else {
    console.log('You are not authorized');
    res.redirect('/');
  }
  // res.send('confirm delete page')
});

module.exports = router;
