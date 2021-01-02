var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    fs = require('fs'),
    path = require('path'),
    aws = require('./aws.service'),
    server, io;

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);
server.listen(5000);

console.log('Listening on port 5000');

io = socketIO(server);

io.on('connection', function (socket) {
    socket.on('upload-image', function (message) {
        var path = 'socketio/' + message.name;

        aws.write(path, message.data).then(function (response) {
            return aws.readFile(path);
        }).then(function (response) {

            var base64 = response.Body.toString('base64');

            socket.emit('image-uploaded', {
                name: 'data:image/jpeg;base64,' +  base64
            });
            
        });

    });
});
