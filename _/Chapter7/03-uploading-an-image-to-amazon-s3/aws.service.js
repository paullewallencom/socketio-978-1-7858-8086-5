var AWS = require('aws-sdk'),
    _ = require('lodash'),
    q = require('q');

var service = {}, s3;

var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME,
    AWS_BUCKET_PATH = process.env.AWS_BUCKET_PATH;

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});

s3 = new AWS.S3();

function write (path, file) {
    var deffered = q.defer();
    
    s3.putObject({
        Bucket: AWS_BUCKET_NAME,
        Key: AWS_BUCKET_PATH + '/' + path,
        Body: file
    }, function (err, data) {
        deffered.resolve(data || err);
    });

    return deffered.promise;
}

function readFile (path) {
    var deffered = q.defer();

    path = path.replace(AWS_BUCKET_PATH + '/', '');

    s3.getObject({
        Bucket: AWS_BUCKET_NAME,
        Key: AWS_BUCKET_PATH + '/' + path
    }, function (err, data) {
        if (!data) {
            deffered.resolve(err);
        } else {
            deffered.resolve(_.extend(data, {
                path: path
            }));
        }
    });

    return deffered.promise;
}

function read (path) {
    var deffered = q.defer();

    readFile(path).then(function (data) {
        if (data.Body) {
            var buf = new Buffer(data.Body);
            deffered.resolve(buf.toString());
        } else {
            deffered.resolve(null);
        }
    });

    return deffered.promise;
}

module.exports = {
    write: write,
    read: read,
    readFile: readFile
};
