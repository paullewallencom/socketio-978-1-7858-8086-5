var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    fs = require('fs'),
    path = require('path'),
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

        var writer = fs.createWriteStream(path.resolve(__dirname, './tmp/' + message.name), {
            encoding: 'base64'
        });

        console.log('Uploading image...');

        writer.write(message.data);
        writer.end();

        writer.on('finish', function () {
            console.log('Image uploaded!');

            socket.emit('image-uploaded', {
                name: '/tmp/' + message.name
            });

        });

    });
});
