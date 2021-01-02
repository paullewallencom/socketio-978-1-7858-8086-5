var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dashboard');
module.exports = mongoose;
