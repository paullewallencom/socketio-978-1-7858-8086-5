var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    jwt = require('jsonwebtoken'),
    server, io;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);
server.listen(5000);

io = socketIO(server);

io.on('connection', function (socket) {

  // Our JWT secret
  var jwtSecret = 'my b1g $3CR3T';

  // Verifies our JWT token and emits a profile if it checks out
  function getProfile (data) {
    jwt.verify(data.token, jwtSecret, function(err, decoded) {

      // Send an error message
      if (err) {
        return socket.emit('profile.error', err);
      }

      // Send a success message
      socket.emit('profile.success', decoded);
    });
  }

  // Get the profile
  socket.on('profile', getProfile);

  // Log the user in
  socket.on('login', function () {

    var profile = {
      firstName: 'Peter',
      lastName: 'Parker',
      email: 'peterparker@spiderman.com',
      id: 12
    };

    var token = jwt.sign(profile, jwtSecret, {
      expiresInMinutes: 60
    });

    socket.emit('login.success', {
      token: token
    });

    getProfile({
      token: token
    });

  });

});
