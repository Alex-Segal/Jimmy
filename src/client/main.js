import React from 'react';
import ReactDOM from 'react-dom';
import Application from './components/app';

document.addEventListener("DOMContentLoaded", function(event) {
    ReactDOM.render(React.createElement(Application, null), document.getElementById("react-container"));
});

import {AddStartupEvent, RequestServer} from './socket';

function PingEvent() {
    var searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.hasOwnProperty('key')) return;
    RequestServer('ping', {
        key: searchParams.key,
    });
}

AddStartupEvent(PingEvent);
setInterval(PingEvent, 30000);
