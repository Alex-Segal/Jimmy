import {GetConnectionKey} from './util/misc';

const socketClient = new WebSocket("wss://voyager.genj.io/wss");
socketClient.onmessage = function(event) {
    var msgData = JSON.parse(event.data);

    //Request Handling
    if (msgData.hasOwnProperty('requestID')) {
        HandleRequests(msgData.requestID, msgData);
        return;
    }

    // Broadcast Handling
    if (msgData.hasOwnProperty('broadcast')) {
        HandleBroadcast(msgData);
        return;
    }
}

const STARTUP_EVENTS = [];
const CLOSE_EVENTS = [];

function AddStartupEvent(callable) {
    STARTUP_EVENTS.push(callable);
}

function AddCloseEvent(callable) {
    CLOSE_EVENTS.push(callable);
}

socketClient.onopen = function(event) {
    RequestServer('auth', {key: GetConnectionKey()}).then(function(auth) {
        if (auth.hasOwnProperty('success')) {
            STARTUP_EVENTS.forEach(v => v(event));
        }
    });
}

socketClient.onclose = function(event) {
    CLOSE_EVENTS.forEach(v => v(event));
}

socketClient.onerror = function(event) {
    if (socketClient.readyState !== 1) {
        CLOSE_EVENTS.forEach(v => v(event));
    }
}

export {AddStartupEvent, AddCloseEvent};

var requestID = 0;
const REQUEST_LIST = {};

function RequestServer(type, data) {
    requestID++;

    socketClient.send(JSON.stringify({
        type: type,
        data: data,
        requestID: requestID,
        key: GetConnectionKey(),
    }));

    return new Promise(function(resolve, reject) {
        REQUEST_LIST[requestID] = {
            resolve: resolve,
            reject: reject,
            stamp: new Date(),
        };
    });
}

export {RequestServer};

function HandleRequests(requestID, data) {
    if (!REQUEST_LIST.hasOwnProperty(requestID)) return;
    var request = REQUEST_LIST[requestID];

    if (data.error) {
        request.reject(data.data);
    } else {
        request.resolve(data.data);
    }

    delete REQUEST_LIST[requestID];
}

const BROADCAST_LIST = {};

function HandleBroadcast(data) {
    if (!BROADCAST_LIST.hasOwnProperty(data.type)) return;
    BROADCAST_LIST[data.type](data.data);
}

function AddBroadcastListen(type, callb) {
    BROADCAST_LIST[type] = callb;
}

export {AddBroadcastListen};

export default socketClient;
