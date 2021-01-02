var sticky = require('sticky-session'),
    http = require('http'),
    express = require('express'),
    socketIO = require('socket.io'),
    cluster = require('cluster');

var server = sticky(function() {

  var app = express(), io;

  server = http.Server(app);

  io = socketIO(server);

  // Add your socket.IO connection logic here

  return server;

});

server.listen(5000, function() {
  if (cluster.isMaster) {
    console.log('Master server started on port 5000');
  } else {
    console.log('- Child server started on port 5000');
  }
});
