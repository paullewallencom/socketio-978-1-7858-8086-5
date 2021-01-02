var md5 = require('MD5'),
    User = require('./userModel'),
    loginUser = require('./loginUser');

// Authenticates a user and logs them in
module.exports = function authenticateUser (socket, data) {

  // Hash the password
  data.password = md5(data.password);

  User.findOne(data, null, function (err, data) {

      // If the username and password are correct, log the user in
      if (data) {
          return loginUser(socket, data);

      // If the username or password are incorrect, emit an error
      } else {
          return socket.emit('user.login.error', err || {
              message: 'Invalid email or password.'
          });
      }
  });

};
