var comments = [{
    user: 'Batman',
    comment: 'Great post!'
}, {
    user: 'Robin',
    comment: 'Interesting ideas...'
}, {
    user: 'Joker',
    comment: 'Thanks, Batman!'
}, {
    user: 'Bruce Wayne',
    comment: 'I agree with Batman'
}];

module.exports = function (socket) {

    // Recent Comments
    for (var i = 0; i < comments.length; i++) {
        socket.emit('comment.add', comments[i]);
        socket.emit('comments.count', {
            count: i + 1
        });
    }


};
