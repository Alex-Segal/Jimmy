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

window.addEventListener('contextmenu', function(e) {
    if (e.target.tagName == 'CANVAS' || e.target.className == 'context-menu' || e.target.className =='context-menu-option') {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
});

import NodeStore from './stores/nodestore';
import ReactART from 'react-art';
const Transform = ReactART.Transform;
window.addEventListener('wheel', function(e) {
    if (e.target.tagName == 'CANVAS') {
        e.preventDefault();

        var transform = new Transform(NodeStore.getState().transform);
        var point = transform.inversePoint(e.offsetX, e.offsetY);
        transform.translate(point.x, point.y);
        if (e.deltaY > 0) {
            transform.scale(0.8, 0.8);
        } else {
            transform.scale(1.2, 1.2);
        }
        transform.translate(-point.x, -point.y);
        NodeStore.updateState({
            transform: transform,
        });
    }
});
