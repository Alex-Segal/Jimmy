import {AddRequest, BroadcastMessage} from './ws';

var NodeList = [];

function AddNewNode() {
    NodeList.push({
        system: 'Jita',
        class: 'H',
        security: 1,
        connections: [],
        pos: {x: 100, y: 100},
    });
}

AddNewNode();

function GetCurrentNodes() {
    return NodeList;
}

AddRequest('get_nodes', function(data) {
    return GetCurrentNodes();
});

AddRequest('new_node_pos', function(data) {
    NodeList[data.node].pos = data.pos;
    SendNodeUpdate(data.node);
    return true;
});

function SendNodeUpdate(nodeidx) {
    BroadcastMessage('node_update', {
        node: NodeList[nodeidx],
        idx: nodeidx,
    });
}

export default GetCurrentNodes;
