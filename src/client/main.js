import React from 'react';
import ReactDOM from 'react-dom';
import Application from './components/app';

document.addEventListener("DOMContentLoaded", function(event) {
    ReactDOM.render(React.createElement(Application, null), document.getElementById("react-container"));
});

import {AddStartupEvent, RequestServer} from './socket';

function PingEvent() {
    var searchParams = new URLSearchParams(window.location.search);
    var key = searchParams.get('key');
    if (!key) return;
    RequestServer('ping', {
        key: key,
    });
}

AddStartupEvent(PingEvent);
setInterval(PingEvent, 30000);
