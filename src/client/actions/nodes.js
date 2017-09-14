import NodeStore from '../stores/nodestore';
import {GetNodeByID} from '../stores/nodestore';
import {RequestServer, AddBroadcastListen} from '../socket';

function UpdateNodePosition(nodeid, newpos) {
    RequestServer('new_node_pos', {
        node: nodeid,
        pos: newpos,
    });

    GetNodeByID(nodeid).pos = newpos;
    NodeStore.updateState({
        activeNode: false,
    });
}

AddBroadcastListen('node_update', function(data) {
    var state = NodeStore.getState();
    var connectionIDs = data.connections.map(v => v.id);
    NodeStore.updateState({
        nodes: state.nodes.filter(v => v.id != data.id).concat([data.node]),
        connections: state.connections.filter(v => connectionIDs.indexOf(v.id) === -1).concat(data.connections),
    });
});

function UpdateSelectedName(name) {
    NodeStore.updateState({
        renamingNode: false
    });

    RequestServer('new_node_name', {
        node: NodeStore.getState().selectedNode,
        name: name,
    });
}

export {UpdateNodePosition, UpdateSelectedName};
