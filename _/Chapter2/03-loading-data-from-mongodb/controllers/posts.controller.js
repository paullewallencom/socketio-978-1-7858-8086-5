module.exports = function (socket) {

    var count = 0;

    var stream = Post.find().stream();

    stream.on('data', function (post) {
        socket.emit('post.add', post);
        socket.emit('posts.count', {
            count: count++
        });
    });
};
