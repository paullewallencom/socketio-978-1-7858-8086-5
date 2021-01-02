var server = require('http').createServer(),
    io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
    socket.on('button-tap', function (btn) {
        io.sockets.emit('button-tapped', btn);
    });
});

server.listen(5000);
