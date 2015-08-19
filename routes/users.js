var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* DELETE individual user. */
router.get('/delete', function(req, res, next) {
  res.render('../views/delete');
  // res.send('confirm delete page')
});

router.post('/testlogin', function(req,res) {
	console.log(req.body);
	res.redirect('/');
});

module.exports = router;
