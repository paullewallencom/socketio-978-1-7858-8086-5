var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    Promise = require('promise'),
    server, io;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);
server.listen(5000);

io = socketIO(server);

function validatePerson (person) {
  return new Promise (function (resolve, reject) {
    if (!person.firstname.length) {
      return reject({
        firstname: 'Please provide a first name.'
      });
    }

    if (!person.lastname.length) {
      return reject({
        lastname: 'Please provide a last name.'
      });
    }

    if (person.firstname === person.lastname) {
      return reject({
        lastname: 'Why is your last name the same your first name? That seems unlikely...'
      });
    }

    // We aren't really saving anything here, but we can still pretend ;)
    return resolve(person);
  });
}

io.on('connection', function (socket) {
  socket.on('person.save', function (person) {
    validatePerson(person).then(function (data) {
      socket.emit('person.save.success', data);

    }).catch(function (data) {
      socket.emit('person.save.error', data);
    });
  });
});
