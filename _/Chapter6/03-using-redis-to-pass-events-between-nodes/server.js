var redisConfig = {
      host: 'localhost',
      port: 6379
    }, server, io;

var express = require('express'),
    http = require('http'),
    socketIO = require('socket.io'),
    redis = require('socket.io-redis'),
    emitter = require('socket.io-emitter')(redisConfig),
    app = express();

if (!process.env.PORT) {
  throw new Error('Please specify a PORT number, ie: PORT=5000 node server');
}

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);
server.listen(process.env.PORT);

io = socketIO(server);
io.adapter(redis(redisConfig));

io.on('connection', function (socket) {
  socket.on('message.sent', function (port) {
    emitter.emit('message.received', port);
  });
});
