import NodeStore from '../stores/nodestore';
import {RequestServer, AddBroadcastListen} from '../socket';

function UpdateNodePosition(nodeidx, newpos) {
    var nodes = NodeStore.getState().nodes;
    var node = nodes[nodeidx];

    RequestServer('new_node_pos', {
        node: nodeidx,
        pos: newpos,
    });

    node.pos = newpos;
    NodeStore.updateState({
        activeNode: false,
        nodes: nodes,
    });
}

AddBroadcastListen('node_update', function(data) {
    var nodes = NodeStore.getState().nodes;
    nodes[data.idx] = data.node;
    NodeStore.updateState({
        nodes: nodes,
    });
});

export {UpdateNodePosition};
