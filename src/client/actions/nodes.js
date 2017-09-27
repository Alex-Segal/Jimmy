import NodeStore from '../stores/nodestore';
import {GetNodeByID} from '../stores/nodestore';
import {RequestServer, AddBroadcastListen} from '../socket';

function UpdateNodePosition(nodeid) {
    var state = NodeStore.getState();
    RequestServer('new_node_pos', {
        nodes: state.nodes.filter(v => nodeid.indexOf(v.id) !== -1).map(v => ({id: v.id, pos: v.pos}))
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

AddBroadcastListen('update_connection_broadcast', function(data) {
    NodeStore.updateState({
        connections: NodeStore.getState().connections.filter(v => v.id != data.connection.id).concat([data.connection])
    });
});

AddBroadcastListen('remove_connection_broadcast', function(data) {
    NodeStore.updateState({
        connections: NodeStore.getState().connections.filter(v => v.id != data),
    });
});

AddBroadcastListen('remove_system_broadcast', function(data) {
    var state = NodeStore.getState();
    NodeStore.updateState({
        connections: state.connections.filter(v => v.nodes.indexOf(data) === -1),
        nodes: state.nodes.filter(v => v.id != data),
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

function UpdateSystem(id, data) {
    RequestServer('update_system', {id: id, data: data});
}

function UpdateConnection(id, data) {
    RequestServer('update_connection', {id: id, data: data});
}

function RemoveConnection(id) {
    RequestServer('remove_connection', id);
}

function RemoveSystem(id) {
    RequestServer('remove_system', id);
}

function AddNewSystem(id, pos) {
    RequestServer('add_new_system', {id: id, pos: pos});
}

export {UpdateNodePosition, UpdateSelectedName, UpdateConnection, RemoveConnection, RemoveSystem, UpdateSystem, AddNewSystem};
