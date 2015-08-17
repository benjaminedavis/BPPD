//=====USER MODEL=====
//Import mongoose
var mongoose = require('mongoose');

//create a user schema
var userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, require: true, unique: true},
  password: { type: String, require: true},
  songs: [{ type: String }]
});

//create user model out of userSchema (constructor function)
var User = mongoose.model('User', userSchema);

//export the model for use within the app
module.exports = User;
