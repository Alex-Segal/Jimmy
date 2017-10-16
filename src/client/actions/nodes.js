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
        connections: state.connections.filter(v => data.filter(i => v.nodes.includes(i)).length === 0),
        nodes: state.nodes.filter(v => !data.includes(v.id)),
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

function RemoveSystem() {
    var state = NodeStore.getState();
    var id = (state.activeNode && state.activeNode.length > 1) ? state.activeNode : [state.contextSystem];
    RequestServer('remove_system', id);
}

function AddNewSystem(id, pos) {
    RequestServer('add_new_system', {id: id, pos: pos});
}

function AddConnection(from, to) {
    RequestServer('add_new_connection', {from: from, to: to});
    NodeStore.updateState({
        linkSystem: false,
    });
}

import {GetConnectionKey} from '../util/misc';

function AddNodePing(system, target) {
    RequestServer('add_node_ping', {
        key: GetConnectionKey(),
        system: system,
        target: target,
    });
}

function SetSystemWaypoint(system, character) {
    RequestServer('set_waypoint', {
        system: system,
        character: character,
    });
}

export {UpdateNodePosition, UpdateSelectedName, UpdateConnection, RemoveConnection,
    RemoveSystem, UpdateSystem, AddNewSystem, AddConnection, AddNodePing, SetSystemWaypoint};
