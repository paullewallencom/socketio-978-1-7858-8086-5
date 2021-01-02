var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    server, io;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);
server.listen(5000);

io = socketIO(server);

io.on('connection', function (socket) {
    socket.on('notifications.join', function () {
        socket.join('notifications');
    });

    socket.on('notifications.leave', function () {
        socket.leave('notifications');
    });
});

var i = 0;
setInterval(function () {
    io.to('notifications').emit('notify', 'This is notification number ' + i);
    i++;
}, 2000);
