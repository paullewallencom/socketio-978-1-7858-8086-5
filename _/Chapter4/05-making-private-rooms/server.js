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

// Include the md5 module
var md5 = require('MD5');

// This is the hashed password to join the private group
// It is the md5 hash of "pass123"
var privatePassword = '32250170a0dca92d53ec9624f336ca24';

console.log(privatePassword);

io.on('connection', function (socket) {

    socket.on('join.group', function (data) {

        // Return and emit a message if the passwords don't match
        if (md5(data.password) !== privatePassword) {
            return socket.emit('message.posted', {
                type: 'danger',
                message: 'Invalid password'
            });
        }

        // Join the group
        socket.join('secret group');
        socket.emit('join.group.success');
    });

    // Post a message to the secret group
    socket.on('message.post', function (data) {
        io.to('secret group').emit('message.posted', {
            type: 'muted',
            message: data.message
        });
    });

});
