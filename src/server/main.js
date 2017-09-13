import {AddAction, BroadcastMessage} from './ws';
import GetCurrentNodes from './nodes';

AddAction('ping', function(ws, msg) {
    ws.send(JSON.stringify({
        type: 'pong',
    }));
});
