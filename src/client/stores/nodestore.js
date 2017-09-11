import Store from 'samsio/Store';
import {RequestSever} from '../socket';

const NodeStore = new Store();
NodeStore.updateState({
    nodes: [],
});

RequestSever('get_nodes', {}).then(function(data) {
    console.log(data);
    NodeStore.updateState({
        nodes: data,
    });
});

export default NodeStore;
