var server = require('http').createServer(),
    io = require('socket.io')(server),
    Chance = require('chance'),
    chance = new Chance(),
    cats = [];

// Generate a random person with chance
function randomPerson () {
    return {
        name: chance.name({ prefix: true }),
        age: chance.age(),
        twitter: chance.twitter(),
        email: chance.email(),
        website: chance.url(),
        image: 'http://lorempixel.com/50/50/cats/' + chance.integer({min: 1, max: 10})
    };
}

// Generate a bunch of random people
for (var i = 0; i < 200; i++) {
    cats.push(randomPerson());
}

io.sockets.on('connection', function (socket) {
    socket.on('get-page', function (data) {
        var catsOnPage = [],
            startAt = data.page * data.per,
            endAt = startAt + data.per;

        // If there are not enough cats to show in one page
        if (cats.length < endAt) {
            endAt = cats.length;
        }

        for (var i = startAt; i < endAt; i++) {
            catsOnPage.push(cats[i]);
        }

        io.sockets.emit('render-page', {
            cats: catsOnPage,
            pages: {
                per: data.per,
                page: data.page,
                last: parseInt(cats.length / data.per, 10)
            }
        });
    });
});

server.listen(5000);
