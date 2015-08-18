//=====USER MODEL=====
//Import mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

//create a user schema
var userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, require: true, unique: true},
  password: { type: String, require: true},
  songs: [{ type: Number }]
});

//encrypting user password method
userSchema.pre('save', function(next){
  var user = this;

  //hash the pw only if the pw has been changed or is new
  if(!user.isModified('password')) return next();
  //easier way to generate salt
  user.password = bcrypt.hashSync(user.password, 10);
  next();
  //generate salt
  bcrypt.genSalt(5, function(err, salt){
    if(err) return next(err);
    bcrypt.hash(user.password, salt,function(err,hash){
      if(err) return next(err);

      //change the password to the hash version
      user.password = hash;
      next();
    });
  });
});

//add an authenticate method to the user schema
userSchema.methods.authenticate = function(password){
  var user = this;

  bcrypt.compare(password, user.password, function(err, isMatch){
    callback(null, isMatch);
  });
};

//create user model out of userSchema (constructor function)
var User = mongoose.model('User', userSchema);

//export the model for use within the app
module.exports = User;
