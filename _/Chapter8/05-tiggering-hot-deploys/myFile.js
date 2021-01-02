app.initialize();

var socket = io('http://localhost:5000');

socket.on('code-change', function () {
    window.location = window.location;
});

var i = 0;
setInterval(function () {
    // Change the thing text set in the container to see the app refresh
    // and display the new code
    document.getElementById('container').innerHTML = '#' + i;
    i++;
}, 500);
