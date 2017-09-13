import Store from 'samsio/Store';
import {RequestServer, AddStartupEvent} from '../socket';

const NodeStore = new Store();
NodeStore.updateState({
    nodes: [],
    activeNode: false,
    track: {x: 0, y: 0},
    click: {x: 0, y: 0},
});

AddStartupEvent(function() {
    RequestServer('get_nodes', {}).then(function(data) {
        NodeStore.updateState({
            nodes: data,
        });
    });
});

export default NodeStore;
