import {AddRequest} from './ws';

var NodeList = [];

function AddNewNode() {
    NodeList.push({
        system: 'Jita',
        security: 1,
        connections: [],
        x: 0,
        y: 0,
    });
}

AddNewNode();

function GetCurrentNodes() {
    return NodeList;
}

AddRequest('get_nodes', function(data) {
    return GetCurrentNodes();
});

export default GetCurrentNodes;
