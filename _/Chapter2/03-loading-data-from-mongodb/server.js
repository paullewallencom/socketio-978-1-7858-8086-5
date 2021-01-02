var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    server, io;
    mongoose = require('./lib/mongo'),
    server, io;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);
server.listen(5000);

io = socketIO(server);

global.Post = require('./models/post')(mongoose);
global.Comment = require('./models/comment')(mongoose);

io.on('connection', function (socket) {
    var controllers = ['comments', 'posts'];
    for (var i = 0; i < controllers.length; i++) {
        require('./controllers/' + controllers[i] + '.controller')(socket);
    }
});
