module.exports = function (port) {

    var express = require('express'),
        http = require('http'),
        socketIO = require('./adapter')(process.env.MEMCACHED_URI, {
          username: process.env.MEMCACHED_USERNAME,
          password: process.env.MEMCACHED_PASSWORD
        }),
        app = express();

    console.log('Starting server on port ' + port);

    app.use(express.static(__dirname));

    var server = http.Server(app);
    server.listen(port);

    var io = socketIO(server);

    io.on('connection', function (socket) {
      socket.on('message.sent', function (port) {
        io.emit('message.received', port);
      });
    });

};
