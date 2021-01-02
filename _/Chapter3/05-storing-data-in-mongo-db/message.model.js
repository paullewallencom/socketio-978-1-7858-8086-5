var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/chatapp');

var messageSchema = db.Schema({
    username: String,
    message: String
});

module.exports = db.model('Message', messageSchema);
