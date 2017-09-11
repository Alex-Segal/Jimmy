import {AddAction, BroadcastMessage} from './ws';

AddAction('ping', function(ws, msg) {
    ws.send(JSON.stringify({
        type: 'pong',
    }));
});
