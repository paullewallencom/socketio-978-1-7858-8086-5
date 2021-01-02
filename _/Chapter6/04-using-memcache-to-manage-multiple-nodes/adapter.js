var memjs = require('memjs'),
    socketIO = require('socket.io'),
    _ = require('lodash');

function Memcached (uri, options) {

    // Create a Memcached connection
    var client = memjs.Client.create(uri, options);

    // This will be the new io method to use instead of the old one
    return function (server) {

        var io = socketIO(server);

        // We will be overriding the emit function, so we'll make a copy of it
        // for us to use later on
        var _emit = io.emit.bind(io);

        // This value represents the last time that the Memcached value was emitted.
        // It will be updated each time there is new data.
        var _lasttime = new Date().getTime();

        function processDataFromCached (err, value, key) {

            // If there is no value, or it can't be parsed to a string,
            // We need to return it so it doesn't break everything
            if (!value || !value.toString()) {
                return;
            }

            // Parse the data back from a string into a JSON object
            value = JSON.parse(value && value.toString());

            // If the data has not been emitted on this server yet...
            if (value.time > _lasttime) {

                // Update the time stamp
                _lasttime = value.time;

                // Emit the new data using the real socket.io emit function
                _emit(value.topic, value.value);
            }
        }

        function checkDataCache () {

            // Get the socket.io key from Memcached
            client.get('socket.io', processDataFromCached);
        }

        // We will intercept the default behaviour of the emit function
        // Not to worry, though. We are holding onto the real socket.io
        // emit function and calling it _emit. We will call the _emit
        // function when we check the cache and notice a change
        io.emit = function (topic, value) {
            client.set('socket.io', JSON.stringify({
                topic: topic,
                value: value,

                // We will use the time stamp to compare to the last time
                // the cache was updated. If it is newer than the value of
                // _lasttime, we will emit the new change
                time: new Date().getTime()
            }));
        };

        // Check the cache on an interval to see if there is a new message
        setInterval(checkDataCache, 500);

        // Return our modified io object
        return io;
    }

}

module.exports = Memcached;
