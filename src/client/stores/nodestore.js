import Store from 'samsio/Store';
import {RequestServer, AddStartupEvent} from '../socket';

const NodeStore = new Store();
NodeStore.updateState({
    nodes: [],
    connections: [],
    activeNode: false,
    track: {x: 0, y: 0},
    click: {x: 0, y: 0},
});

AddStartupEvent(function() {
    RequestServer('get_nodes', {}).then(function(data) {
        NodeStore.updateState({
            nodes: data.nodes,
            connections: data.connections,
        });
    });
});

function GetNodeByID(id) {
    return NodeStore.getState().nodes.filter(v => v.id == id).reduce((acc, v) => v, false);
}

export {GetNodeByID};

export default NodeStore;
