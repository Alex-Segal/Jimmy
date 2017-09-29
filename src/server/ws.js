import * as WebSocket from 'ws';

const wss = new WebSocket.Server({port: 8941});
const wsActions = {};
const wsRequests = {};

function AddAction(type, callb) {
    wsActions[type] = callb;
}

function AddRequest(type, callb) {
    wsRequests[type] = callb;
}

function BroadcastMessage(type, data) {
    wss.clients.forEach(function(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: type,
                broadcast: true,
                data: data,
            }));
        }
    });
}

export {AddAction, AddRequest, BroadcastMessage};

function ParseMessage(msg) {
    var data = {};
    try {
        data = JSON.parse(msg);
    } catch (e) {
        console.error(['json error', e]);
        return;
    }

    if (!data.hasOwnProperty('type')) return;
    if (wsActions.hasOwnProperty(data.type)) {
        wsActions[data.type](this, msg);
    }
    if (wsRequests.hasOwnProperty(data.type)) {
        HandleRequest(this, data);
    }
}

var ValidKeys = [];

function HandleRequest(ws, data) {
    if (ws.readyState !== ws.OPEN) return;
    if (ValidKeys.indexOf(data.key) === -1 && data.type !== 'auth') {
        ws.send(JSON.stringify({error: 'no auth'}));
        return;
    }
    var result = wsRequests[data.type](data.data, ws);
    Promise.resolve(result).then(function(dobj){
        ws.send(JSON.stringify({
            type: data.type,
            requestID: data.requestID,
            data: dobj
        }));
    });
}

function AddKey(key) {
    ValidKeys.push(key);
}

function RemoveKey(key) {
    ValidKeys = ValidKeys.filter(v => v != key);
}

export {AddKey, RemoveKey};

wss.on('connection', function(client) {
    client.on('message', ParseMessage);
});
