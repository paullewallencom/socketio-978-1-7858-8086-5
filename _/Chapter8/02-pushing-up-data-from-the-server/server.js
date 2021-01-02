var server = require('http').createServer(),
    io = require('socket.io')(server),
    request = require('request');

io.sockets.on('connection', function (socket) {

    socket.on('set-location', function (location) {
        request('http://api.openweathermap.org/data/2.5/weather?q=' + location, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                socket.emit('weather-change', JSON.parse(body));
            }
        });
    });

});

server.listen(5000);
