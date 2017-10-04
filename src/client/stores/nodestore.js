import Store from 'samsio/Store';
import ReactART from 'react-art';
const Transform = ReactART.Transform;

const NodeStore = new Store();
NodeStore.updateState({
    nodes: [],
    connections: [],
    activeNode: false,
    activeNodeOffsets: [],
    selectedNode: false,
    renamingNode: false,
    track: {x: 0, y: 0},
    click: {x: 0, y: 0},
    clickOffset: {x: 0, y: 0},
    transform: new Transform(),
    contextConnection: false,
    contextSystem: false,
    contextMap: false,
    selection: false,
    gridsnapping: true,
    detailview: false,
    pinpanel: false,
    linkSystem: false,
    showTimers: false,
});

function GetNodeByID(id) {
    return NodeStore.getState().nodes.filter(v => v.id == id).reduce((acc, v) => v, false);
}

export {GetNodeByID};

export default NodeStore;
