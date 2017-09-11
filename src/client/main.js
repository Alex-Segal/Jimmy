import React from 'react';
import ReactDOM from 'react-dom';
import Application from './components/app';

document.addEventListener("DOMContentLoaded", function(event) {
    ReactDOM.render(React.createElement(Application, null), document.getElementById("react-container"));
});


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
