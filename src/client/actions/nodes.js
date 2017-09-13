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
    NodeStore.updateState({
        nodes: NodeStore.getState().nodes.filter(v => v.id != data.id).concat([data.node]),
    });
});

export {UpdateNodePosition};
