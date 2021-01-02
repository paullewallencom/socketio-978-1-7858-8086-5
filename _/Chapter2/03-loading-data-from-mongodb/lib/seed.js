var mongoose = require('./mongo'),
    Post = require('../models/post')(mongoose),
    Comment = require('../models/comment')(mongoose);

// New comments
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

// Loop over new comments and create them
for (var i = 0; i < comments.length; i++) {
    new Comment(comments[i]).save();
}

// New posts
var posts = [{
    user: 'Two-Face',
    title: 'How to Flip a Coin'
}, {
    user: 'Joker',
    title: 'Top 5 Jokes of 2015'
}];

// Loop over new posts and create them
for (var i = 0; i < posts.length; i++) {
    new Post(posts[i]).save();
}

console.log('Database Seeded');
