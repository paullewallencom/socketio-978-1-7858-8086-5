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

function createNamespace (i) {
    var group = io.of('/group-' + i);
    group.on('connection', function(socket) {
        socket.on('message.send', function (data) {
            group.emit('message.sent', data);
        });
    });
}

for (var i = 0; i < 2; i++) {
    createNamespace(i);
}
