var Message = require('./message.model');

module.exports = function (io) {

    io.on('connection', function (socket) {

        var stream = Message.find().stream();

        stream.on('data', function (message) {
            socket.emit('message.sent', message);
        });

        socket.on('message.send', function (data) {
            var message = new Message(data);
            message.save().then(function (message) {
                io.emit('message.sent', message);
            });
        });

        socket.on('message.destroy', function (_id) {
            Message.findByIdAndRemove(_id).then(function (message) {
                io.emit('message.destroyed', message);
            });
        });
    });

};
