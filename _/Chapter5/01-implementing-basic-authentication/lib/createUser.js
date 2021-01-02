var md5 = require('MD5'),
    User = require('./userModel'),
    loginUser = require('./loginUser');

// Creates a new user
module.exports = function createUser (socket, data) {

  // Hash the password
  data.password = md5(data.password);

  // Create a new user in MongoDB
  var user = new User(data);

  // Save the MongoDB Model
  user.save().then(function (data) {
     return loginUser(socket, data);
  });

};
