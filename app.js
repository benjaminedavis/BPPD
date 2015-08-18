//=====BASE SETUP=====
//Call our packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); //creating a schema in mongo
var morgan = require('morgan'); //used to see the requests in console
var dotenv = require('dotenv').load(); // used to load environment variables for api keys
var sc = require('node-soundcloud'); // soundcloud api package

var routes = require('./routes/index');
//Database connection
mongoose.connect('mongodb://localhost/bppd'); //database connection string for dev
// mongoose.connect('mongodb://bendavis:bendavis@ds035593.mongolab.com:35593/bppd'); //database connection string
var User = require('./models/user');

//=====APP CONFIG=====
var app = express();
var apiRouter = express.Router();

//=====INITIALIZE SOUNDCLOUD API WITH KEYS IN .env FILE
sc.init({
  id: process.env.SOUNDCLOUD_CLIENT_ID,
  secret: process.env.SOUNDCLOUD_CLIENT_SECRET,
  uri: 'http://0.0.0.0:8080'
});
//====================

//use morgan to show requests
app.use(morgan('dev'));
//use body-parser so we can grab info from params.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', User);

//=====REGISTER ROUTES
//Allows to be part of your express app
app.use('/api', apiRouter);
//====================

//=====API ROUTES=====
//New and Show all users
apiRouter.route('/users')
  .post(function(req, res){
    //create a new instance of the user model
    var user = new User(req.body);

    //save the user and encrypt the pw
    user.save(function(err){
      if(err){
        return res.status(401).send({message: err.errmsg});
      }else{
        return res.status(200).send({message: 'user created!'});
      };
    });
  })
  .get(function(req, res){
    User.find({}, function(err, users){
      if(err) return res.status(401).send({message: err.errmsg});
      res.json(users);
      console.log("successful");
    });
  });

  //Show, update, and delete User
  apiRouter.route('/users/:id')
    .get(function(req, res){
      User.findOne({_id: req.params.id}, function(err, user){
        if(err) res.json({message: "Error: Could not find user"});
        res.json(user);
      });
    })
    .patch(function(req, res){
      User.findOneAndUpdate({_id: req.params.id}, req.body.user, function(err, user){
        if(err) res.json({message: "Error: Could not update"})
        res.json(user);
      });
    })
    .delete(function(req, res){
      User.findOneAndRemove({_id: req.params.id}, function(err, user){
        if(err) res.json({message: "Error: Could not delete"})
        res.json({message: "User was deleted"})
      });
    });

  //TEST SOUNDCLOUD API REQUESTS:
  apiRouter.route('/search')
    .get(function(req,res){
      sc.get('/tracks', {q: req.query.searchString}, function(err, results) {
        if( err ) {
          throw err;
        } else {
          var songIds = [];
          for(var i = 0; i < results.length; i += 1) {
            songIds.push(results[i].id);
          }
          res.json(songIds); //return just song titles from url params search:
          //console.log(results); //return complete result objects
          //res.json(results);
        }
      })
    });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
