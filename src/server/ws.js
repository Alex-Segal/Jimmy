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

function HandleRequest(ws, data) {
    var result = wsRequests[data.type](data.data, ws);
    Promise.resolve(result).then(function(dobj){
        ws.send(JSON.stringify({
            type: data.type,
            requestID: data.requestID,
            data: dobj
        }));
    });
}

wss.on('connection', function(client) {
    client.on('message', ParseMessage);
    if (wsActions.hasOwnProperty('startup')) {
        client.send(JSON.stringify(wsActions.startup()));
    }
});
