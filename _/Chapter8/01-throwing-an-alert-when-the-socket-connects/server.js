var server = require('http').createServer();
var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {

    console.log('App socket connected');

    socket.emit('alert', 'This app is connected to Socket.IO!');
});

server.listen(5000);
