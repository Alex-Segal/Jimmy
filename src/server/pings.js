import fetch from 'node-fetch';
import {GetConnectionByKey} from './characters';
import {SaveSystem, SaveSystemPing, GetPings} from './db';
import {AddRequest} from './ws';
import {GetNodeByID} from './nodes';

AddRequest('add_node_ping', function(data) {
    var system = GetNodeByID(data.system);
    if (!system) return;
    var connection = GetConnectionByKey(data.key);
    if (!connection || !connection.character) return;
    SaveSystem(system.id, system.system, system.name);
    SaveSystemPing(system.id, connection.character[0].discord_id, data.target);
});

function HandleNewConnection(newSystem) {
    GetPings(newSystem.id).then(function(pings) {
        return fetch("http://localhost:8091/pings/ping", {
            method: 'POST',
            body: JSON.stringify(pings),
        });
    }).catch(function(e) {
        // No pings
    });
}

export {HandleNewConnection};
