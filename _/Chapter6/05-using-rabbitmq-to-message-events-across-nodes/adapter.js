var amqp = require('amqplib'),
    socketIO = require('socket.io'),
    _ = require('lodash');

function RabbitMQ (uri, options) {

    // This will become a reference to the RabbitMQ connection
    var client;

    // This will be the new io method to use instead of the old one
    return function (server) {

        var io = socketIO(server);

        // We will be overriding the emit function, so we'll make a copy of it
        // for us to use later on
        var _emit = io.emit.bind(io);

        function processDataFromCached (message) {

            // If there is no value, or it can't be parsed to a string,
            // We need to return it so it doesn't break everything
            if (!message || !message.content) {
                return;
            }

            // Parse the data back from a string into a JSON object
            var value = JSON.parse(message.content.toString());

            // Emit the new data using the real socket.io emit function
            _emit(value.topic, value.value);

            // Ack it back to the RabbitMQ que
            client.ack(message);
        }

        // We will intercept the default behaviour of the emit function
        // Not to worry, though. We are holding onto the real socket.io
        // emit function and calling it _emit. We will call the _emit
        // function when we check the cache and notice a change
        io.emit = function (topic, value) {

            if (!client) {
                return console.warn('The RabbitMQ channel is not available...');
            }

            // Loop over the ports to emit to
            _.each(options.sendTo, function (portNumber) {
                client.sendToQueue('socket.io', new Buffer(JSON.stringify({
                    topic: topic,
                    value: value
                })));
            });

        };

        // Create a RabbitMQ connection
        amqp.connect(uri).then(function(connection) {

            // Create a channel from the connection
            connection.createChannel().then(function(channel) {

                // Store a reference to the channel to use on the outside
                client = channel;

                // Listen for events on the que
                client.assertQueue('socket.io', {
                    durable: false
                }).then(function () {

                    // Consume new events
                    client.consume('socket.io', processDataFromCached);
                    
                });
            });
        });

        // Return our modified io object
        return io;
    }

}

module.exports = RabbitMQ;
