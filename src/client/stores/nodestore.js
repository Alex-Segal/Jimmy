import Store from 'samsio/Store';

const NodeStore = new Store();
NodeStore.updateState({
    nodes: [],
});

export default NodeStore;
