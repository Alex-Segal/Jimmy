import {AddRequest} from './ws';

var NodeList = [];

function AddNewNode() {
    NodeList.push({
        system: 'Jita',
        class: 'H',
        security: 1,
        connections: [],
        x: 100,
        y: 100,
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
