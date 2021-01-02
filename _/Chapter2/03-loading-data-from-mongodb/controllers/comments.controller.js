module.exports = function (socket) {

    var count = 0;

    var stream = Comment.find().stream();

    stream.on('data', function (comment) {
        socket.emit('comment.add', comment);
        socket.emit('comments.count', {
            count: count++
        });
    });

};
