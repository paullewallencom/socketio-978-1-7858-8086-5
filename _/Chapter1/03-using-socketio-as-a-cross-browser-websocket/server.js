var io = require('socket.io')(5000),
    sockets = [];

io.on('connection', function (socket) {
    sockets.push(socket);
    socket.on('message', function (message) {
        for (var i = 0; i < sockets.length; i++) {
            sockets[i].send(message);
        }
    });
    socket.on('disconnect', function () {
        for (var i = 0; i < sockets.length; i++) {
            if (sockets[i].id === socket.id) {
                sockets .splice(i, 1);
            }
        }
        console.log('The socket disconnected');
    });
});
