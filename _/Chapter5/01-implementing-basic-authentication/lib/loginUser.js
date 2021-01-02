var crypto = require('crypto'),
    getUser = require('./getUser');

// Logs in a user
module.exports = function loginUser (socket, user) {

    // Create a token with crypto
    var token = crypto.randomBytes(64).toString('base64');

    // Save the user session
    userSessions[token] = user;

    // Get the user belonging to the token and emit it
    return getUser(socket, token);
};
