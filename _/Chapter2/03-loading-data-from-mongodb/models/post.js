module.exports = function (mongoose) {
    var postSchema = mongoose.Schema({
        user: String,
        title: String
    });

    return mongoose.model('Post', postSchema);
};
