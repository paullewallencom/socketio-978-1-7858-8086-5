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

var getUser = require('./lib/getUser'),
    loginUser = require('./lib/loginUser'),
    createUser = require('./lib/createUser'),
    authenticateUser = require('./lib/authenticateUser');

global.userSessions = {};

io.on('connection', function (socket) {

    // Get the authenticated user
    socket.on('user.get', function (token) {
        getUser(socket, token);
    });

    // Create a new user
    socket.on('user.create', function (data) {
        console.log('user.create');
        createUser(socket, data);
    });

    // Login
    socket.on('user.login', function (data) {
        authenticateUser(socket, data);
    });

    // Log the authenticated user out
    socket.on('user.logout', function (token) {
        delete userSessions[token];
    });
});
