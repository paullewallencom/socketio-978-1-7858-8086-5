var express = require('express'),
    app = express(),
    http = require('http'),
    fs = require('fs'),
    path = require('path'), io, server;

app.use(express.static(__dirname));

server = http.Server(app);
server.listen(5000);

io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {

    console.log('App socket connected');

    socket.emit('alert', 'This app is connected to Socket.IO!');
});

var filePath = path.resolve(__dirname, './myFile.js');

fs.watchFile(filePath, function () {
    io.sockets.emit('code-change');
});
