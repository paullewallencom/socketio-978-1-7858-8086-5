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
    socket.emit('room.joined', socket.id + ' joined the hallway');
    socket.on('room.join', function (room) {
        socket.join(room);
        io.to(room).emit('room.joined', socket.id + ' joined the ' + room);
    });
});
