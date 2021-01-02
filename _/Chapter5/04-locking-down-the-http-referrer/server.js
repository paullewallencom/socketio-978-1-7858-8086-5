var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    server, server2, io;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);
server.listen(5000);

server2 = http.Server(app);
server2.listen(5001);

io = socketIO(server);

io.on('connection', function (socket) {
  switch (socket.request.headers.referer) {
    case 'http://localhost:5000/':
      socket.emit('permission.message', 'Okay, you\'re cool.');
    break;
    default:
      socket.emit('permission.message', 'Who invited you to this party?');
    break;
  }
});
