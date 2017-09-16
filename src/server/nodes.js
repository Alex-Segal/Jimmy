import fs from 'fs';
import {AddRequest, BroadcastMessage} from './ws';
import BuildSystemData from './wormholes';

var WNodeList = [];
var ConnectionList = [];
var ConnectionID = 1;

function LoadNodes() {
    fs.readFile('nodes.json', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        data = JSON.parse(data);
        WNodeList = data.nodes,
        ConnectionList = data.connections;
        ConnectionID = Math.max.apply(Math, data.connections.map(v => v.id).concat([1])) + 1;
    });
}
LoadNodes();

function GetCurrentNodes() {
    return {
        nodes: WNodeList,
        connections: ConnectionList,
    };
}

AddRequest('get_nodes', function(data) {
    return GetCurrentNodes();
});

AddRequest('new_node_pos', function(data) {
    data.nodes.forEach(function(v) {
        var node = GetNodeByID(v.id);
        if (!node) return false;
        node.pos = v.pos;
        SendNodeUpdate(v.id);
        return true;
    });
});

AddRequest('new_node_name', function(data) {
    var node = GetNodeByID(data.node);
    if (!node) return false;
    node.nickname = data.name;
    SendNodeUpdate(data.node);
});

AddRequest('update_connection', function(data) {
    var connection = GetConnectionByID(data.id);
    if (!connection) return;
    if (data.data.hasOwnProperty('eol')) {
        if (connection.eol) {
            connection.eol = false;
        } else {
            connection.eol = Date.now();
        }
    }
    if (data.data.hasOwnProperty('frigate')) {
        connection.frigate = !connection.frigate;
    }
    BroadcastMessage('update_connection_broadcast', {
        connection: connection,
    });
});

AddRequest('remove_system', function(data) {
    ConnectionList = ConnectionList.filter(v => v.nodes.indexOf(data) === -1),
    WNodeList = WNodeList.filter(v => v.id !== data);
    BroadcastMessage('remove_system_broadcast', data);
});

AddRequest('remove_connection', function(data) {
    ConnectionList = ConnectionList.filter(v => v.id != data);
    BroadcastMessage('remove_connection_broadcast', data);
});

function GetNodeByID(id) {
    return WNodeList.filter(v => v.id == id).reduce((acc, v) => v, false);
}

function GetConnectionByID(id) {
    return ConnectionList.filter(v => v.id == id).reduce((acc, v) => v, false);
}

function SendNodeUpdate(nodeid) {
    var node = GetNodeByID(nodeid);
    if (!node) return;
    BroadcastMessage('node_update', {
        node: node,
        id: nodeid,
        connections: ConnectionList.filter(v => v.nodes.indexOf(nodeid) !== -1),
    });
}

function AddConnection(oldLocation, newLocation) {
    var connection = ConnectionList.filter(v => v.nodes.indexOf(newLocation) !== -1 && v.nodes.indexOf(oldLocation) !== -1);
    if (connection.length > 0) return;
    ConnectionList.push({
        id: ConnectionID,
        eol: false,
        frigate: false,
        mass: 'normal',
        nodes: [oldLocation, newLocation],
    });
    ConnectionID++;
}

 function IsKSpace(system) {
     return ['H', 'L', 'N'].indexOf(system.class) !== -1;
 }

function CharacterMoved(oldLocation, newLocation) {
    var newSystem = GetNodeByID(newLocation);
    var oldSystem = GetNodeByID(oldLocation);
    if (!newSystem) {
        newSystem = BuildSystemData(newLocation);
        if (!newSystem) {
            console.error("Could not find: " + newLocation);
            return;
        }
        if (oldSystem && IsKSpace(oldSystem) && IsKSpace(newSystem)) {
            return;
        }
        WNodeList.push(newSystem);
    }

    if (oldSystem) {
        AddConnection(oldLocation, newLocation);
    }

    SendNodeUpdate(newLocation);
}
export {CharacterMoved};

function SaveNodes() {
    fs.writeFile('nodes.json', JSON.stringify(GetCurrentNodes()), (err) => console.error(err));
}
setInterval(SaveNodes, 60000);

export default GetCurrentNodes;
