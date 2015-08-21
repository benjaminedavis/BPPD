var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'stratus', token: req.token });
});

/* GET ABOUT page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'stratus', token: req.token });
});

module.exports = router;
