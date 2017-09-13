import {AddRequest, BroadcastMessage} from './ws';

var WNodeList = [];
var ConnectionList = [];

function AddNewNode() {
    WNodeList.push({
        id: 1,
        system: 'Jita',
        class: 'H',
        security: 1,
        pos: {x: 100, y: 100},
    });
    WNodeList.push({
        id: 2,
        system: 'Perimeter',
        class: 'H',
        security: 1,
        pos: {x: 300, y: 200},
    });
    ConnectionList.push({
        id: 1,
        status: 'normal',
        nodes: [1,2],
    });
}

AddNewNode();

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
    var node = GetNodeByID(data.node);
    if (!node) return false;
    node.pos = data.pos;
    SendNodeUpdate(data.node);
    return true;
});

function GetNodeByID(id) {
    return WNodeList.filter(v => v.id == id).reduce((acc, v) => v, false);
}

function SendNodeUpdate(nodeid) {
    var node = GetNodeByID(nodeid);
    if (!node) return;
    BroadcastMessage('node_update', {
        node: node,
        id: nodeid,
    });
}

export default GetCurrentNodes;
