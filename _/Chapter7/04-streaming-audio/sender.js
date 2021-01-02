var answersFrom = {};

navigator.getUserMedia({ audio: true }, function (stream) {
    pc.addStream(stream);
}, error);

function createOffer () {
    pc.createOffer(function(offer) {
        pc.setLocalDescription(new sessionDescription(offer), function () {
            socket.emit('make-offer', {
                offer: offer
            });
        }, error);
    }, error);
}

socket.on('answer-made', function (data) {
    pc.setRemoteDescription(new sessionDescription(data.answer), function () {
        if (!answersFrom[data.socket]) {
            createOffer(data.socket);
            answersFrom[data.socket] = true;
        }
    }, error);
});

var btn = document.getElementById('broadcast');
btn.addEventListener('click', function () {
    if (btn.getAttribute('class') === 'stop') {
        btn.setAttribute('class', 'play');
        btn.innerHTML = 'Broadcast';
    } else {
        btn.setAttribute('class', 'stop');
        btn.innerHTML = 'Broadcasting...';
        createOffer();
    }
});
