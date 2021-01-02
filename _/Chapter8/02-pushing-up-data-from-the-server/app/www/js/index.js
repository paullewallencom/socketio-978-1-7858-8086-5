var socket = io('http://localhost:5000');

document.getElementById('submit-weather').addEventListener('submit', function (e) {
    var location = document.getElementById('location').value;
    e.preventDefault();
    document.getElementById('location-name').innerHTML = 'Loading...';
    socket.emit('set-location', location);
});

socket.on('weather-change', function (data) {
    document.getElementById('location-name').innerHTML = data.name + ' ' +
        ' <img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png">';
    document.getElementById('weather-main').innerHTML = data.weather[0].main;
    document.getElementById('weather-description').innerHTML = data.weather[0].description;
});
