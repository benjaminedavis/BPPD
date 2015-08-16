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

var routes = require('./routes/index');
//Database connection
var User = require('./models/user');

//=====APP CONFIG=====
var app = express();
var apiRouter = express.Router();

//=====REGISTER ROUTES
//Allows to be part of your express app
app.use('/api', apiRouter);
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

//=====API ROUTES=====
apiRouter.route('/users')
  .post(function(req, res){
    //create a new instance of the user model
    var user = new User(req.body.user);

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

  apiRouter.route('/users/:id')
    .get(function(req, res){
      User.findOne({_id: req.params.id}, function(err, user){
        if(err) res.json({message: "You're WRONG!"});
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
