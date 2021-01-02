module.exports = function (mongoose) {
    var commentSchema = mongoose.Schema({
        user: String,
        comment: String
    });

    return mongoose.model('Comment', commentSchema);
};
