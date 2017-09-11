const socketClient = new WebSocket("wss://jimmy.genj.io/wss");
socketClient.onmessage = function(event) {
    var msgData = JSON.parse(event.data);
    if (msgData.type === 'ping') {
        console.log('pong');
    }
}

setInterval(function() {
    socketClient.send(JSON.stringify({
        type: 'ping',
    }));
}, 30000);
