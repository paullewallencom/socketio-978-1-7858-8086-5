var https = require('https'),
    pem = require('pem'),
    express = require('express'),
    app = express(),
    socketIO = require('socket.io');

// Create a self-signed certificate with pem
pem.createCertificate({
    days: 1,
    selfSigned: true
}, function (err, keys) {

  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

  // Create an https server with the certificate and key from pem
  var server = https.createServer({
      key: keys.serviceKey,
      cert: keys.certificate
  }, app).listen(5000);

  var io = socketIO(server);

  io.on('connection', function (socket) {
      var protocol = 'ws://';

      // Check the handshake to determine if it was secure or not
      if (socket.handshake.secure) {
          protocol = 'wss://';
      }

      socket.emit('hello.client', {
          message: 'This is a message from the server. It was sent using the ' + protocol + ' protocol'
      });
  });
});
