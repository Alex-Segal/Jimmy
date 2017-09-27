import React from 'react';
import ReactDOM from 'react-dom';
import Application from './components/app';
import ViewStore from './stores/view';
import 'react-select/dist/react-select.css';
import ReadSigs from './util/sigread';
import NodeStore from './stores/nodestore';
import {GetConnectionKey} from './util/misc';

document.addEventListener("DOMContentLoaded", function(event) {
    ReactDOM.render(React.createElement(Application, null), document.getElementById("react-container"));
});

import {AddStartupEvent, RequestServer} from './socket';

function PingEvent() {
    var key = GetConnectionKey();
    RequestServer('ping', {
        key: key,
    }).then(function(data) {
        if (!data) return;
        ViewStore.updateState({
            characters: data,
        });
    });
}

AddStartupEvent(PingEvent);
setInterval(PingEvent, 30000);

AddStartupEvent(function() {
    RequestServer('get_nodes', {key: GetConnectionKey()}).then(function(data) {
        NodeStore.updateState({
            nodes: data.nodes,
            connections: data.connections,
        });
    });
});

window.addEventListener('contextmenu', function(e) {
    if (e.target.tagName == 'CANVAS' || e.target.className == 'context-menu' || e.target.className =='context-menu-option') {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
});

// Window zoom
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

window.addEventListener('paste', function(e) {
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    var clipboardData = e.clipboardData || window.clipboardData;
    var pastedData = clipboardData.getData('Text');
    ReadSigs(pastedData);
});

// Touch fixes
function TranslateTouchToCanvas(e) {
    if (e.target.tagName !== 'CANVAS') return;
    e.stopPropagation();
    var translateTypes = {
        touchstart: 'mousedown',
        touchmove: 'mousemove',
        touchend: 'mouseup',
    };
    e.target.dispatchEvent(new MouseEvent(translateTypes[e.type], {
        button: 4,
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY,
    }));
}
window.addEventListener('touchstart', TranslateTouchToCanvas);
window.addEventListener('touchmove', TranslateTouchToCanvas);
window.addEventListener('touchend', TranslateTouchToCanvas);
