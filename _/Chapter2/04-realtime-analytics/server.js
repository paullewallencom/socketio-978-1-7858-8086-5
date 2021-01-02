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

var count = 0;

io.on('connection', function (socket) {
    count++;
    io.emit('users.count', count);
    
    socket.on('disconnect', function () {
        count--;
        io.emit('users.count', count);
    });
});
