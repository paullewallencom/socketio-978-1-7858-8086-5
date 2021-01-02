var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    fs = require('fs'),
    path = require('path'),
    server, io;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);
server.listen(5000);

io = socketIO(server);

io.on('connection', function (socket) {
    var readStream = fs.createReadStream(path.resolve(__dirname, './woodchuck.jpg'), {
        encoding: 'binary'
    }), chunks = [], delay = 0;

    readStream.on('readable', function () {
        console.log('Image loading');
    });

    readStream.on('data', function (chunk) {
        chunks.push(chunk);
        delay = delay + 1000;
        setTimeout(function () {
            socket.emit('img-chunk', chunk);
        }, delay);
    });

    readStream.on('end', function () {
        console.log('Image loaded');
    });
});
