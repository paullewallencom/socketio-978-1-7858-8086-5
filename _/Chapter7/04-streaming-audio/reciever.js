var offerData,
    player = new Audio(),
    btn = document.getElementById('btn');

btn.addEventListener('click', function () {
    if (btn.getAttribute('class') === 'play') {
        listen();
        player.play();
    } else if (btn.getAttribute('class') === 'stop') {
        player.pause();
        btn.setAttribute('class', 'muted');
        btn.innerHTML = 'No Station...';
    }
});

function listen () {
    btn.setAttribute('class', 'stop');
    btn.innerHTML = 'Listening';

    pc.setRemoteDescription(new sessionDescription(offerData.offer), function () {
        pc.createAnswer(function (answer) {
          pc.setLocalDescription(new sessionDescription(answer), function () {
              socket.emit('make-answer', {
                  answer: answer,
                  to: offerData.socket
              });
          }, error);
        }, error);
    }, error);
}

pc.onaddstream = function (obj) {
    console.log('addStream');
    player.src = window.URL.createObjectURL(obj.stream);
};

socket.on('offer-made', function (data) {
    btn.setAttribute('class', 'play');
    btn.innerHTML = 'Listen';
    offerData = data;
});
