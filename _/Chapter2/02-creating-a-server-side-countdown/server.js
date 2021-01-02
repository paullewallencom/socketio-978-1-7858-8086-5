var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    moment = require('moment'),
    server, io;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);
server.listen(5000);

io = socketIO(server);

io.on('connection', function (socket) {
    setInterval(function () {
        socket.emit('seconds.update', {
            time: new Date()
        });
    }, 1000);
});
