import fs from 'fs';
import {AddRequest, BroadcastMessage} from './ws';
import {SaveSystemLog, SaveConnectionLog, SaveSystemCorporation, GetSystemCorporation} from './db';
import {RefreshConnection} from './auth';
import BuildSystemData from './wormholes';

var WNodeList = [];
var ConnectionList = [];
var ConnectionID = 1;

function LoadNodes() {
    fs.readFile('nodes.json', (err, data) => {
        if (err) {
            console.error(['load', err]);
            return;
        }
        data = JSON.parse(data);
        WNodeList = data.nodes,
        ConnectionList = data.connections;
        ConnectionID = Math.max.apply(Math, data.connections.map(v => v.id).concat([1])) + 1;
    });
}
LoadNodes();

function GetCurrentNodes() {
    return {
        nodes: WNodeList,
        connections: ConnectionList,
    };
}

AddRequest('get_nodes', function(data, ws) {
    return RefreshConnection(data.key).then(function(chars) {
        if (chars.hasOwnProperty('error') || chars.length <= 0) throw 'No auth';
        return GetCurrentNodes();
    }).catch(function(e) {
        ws.close();
    });
});

AddRequest('new_node_pos', function(data) {
    data.nodes.forEach(function(v) {
        var node = GetNodeByID(v.id);
        if (!node) return false;
        if (Math.abs(node.pos.x - v.pos.x) < 1 && Math.abs(node.pos.y - v.pos.y) < 1) return;
        node.pos = v.pos;
        SendNodeUpdate(v.id);
        return true;
    });
});

AddRequest('new_node_name', function(data) {
    var node = GetNodeByID(data.node);
    if (!node) return false;
    node.nickname = data.name;
    SendNodeUpdate(data.node);
});

AddRequest('update_connection', function(data) {
    var connection = GetConnectionByID(data.id);
    if (!connection) return;
    if (data.data.hasOwnProperty('eol')) {
        if (connection.eol) {
            connection.eol = false;
        } else {
            connection.eol = Date.now();
        }
    }
    if (data.data.hasOwnProperty('size')) {
        if (connection.size == data.data.size) {
            connection.size = false;
        } else {
            connection.size = data.data.size;
        }
    }
    if (data.data.hasOwnProperty('mass')) {
        connection.mass = data.data.mass;
    }
    BroadcastMessage('update_connection_broadcast', {
        connection: connection,
    });
});

AddRequest('add_new_connection', function(data) {
    var fromSystem = GetNodeByID(data.from);
    var toSystem = GetNodeByID(data.to);
    if (!fromSystem || !toSystem) return false;
    AddConnection(data.from, data.to);
    SendNodeUpdate(toSystem.id);
});

AddRequest('update_system', function(data) {
    var node = GetNodeByID(data.id);
    if (!node) return false;
    if (data.data.hasOwnProperty('locked')) {
        node.locked = data.data.locked;
    }
    if (data.data.hasOwnProperty('sig')) {
        var sig = node.sigs.filter(v => v.sig == data.data.sig)[0];
        if (!sig) return;
        sig.connection = data.data.connection;
    }
    SendNodeUpdate(data.id);
});

AddRequest('update_sigs', function(data) {
    var node = GetNodeByID(data.node);
    if (!node) return false;
    node.scantime = Date.now();
    node.sigs = data.sigs.map(function(v) {
        var sig = node.sigs.filter(s => s.sig == v.sig)[0];
        if (!sig) return v; // No old signature, use new
        if (sig.site && sig.site.length > 0) return sig; // Old signature has been scanned already, don't replace.
        return v; // New empty vs old empty, same diff lol.
    });
    SendNodeUpdate(data.node);
});

import {HandleNewConnection} from './pings';

function AddSystem(system, chr) {
    HandleNewConnection(system);
    WNodeList.push(system);
    return GetSystemCorporation(system.id).then(function(corp) {
        console.log(corp);
        system.corp = corp;
        return system.id;
    }).catch(function(e) {
        console.error(e);
    });
}

AddRequest('remove_system', function(data) {
    if (!Array.isArray(data)) return;
    ConnectionList = ConnectionList.filter(v => data.filter(i => v.nodes.includes(i)).length === 0),
    WNodeList = WNodeList.filter(v => !data.includes(v.id));
    BroadcastMessage('remove_system_broadcast', data);
});

AddRequest('remove_connection', function(data) {
    ConnectionList = ConnectionList.filter(v => v.id != data);
    BroadcastMessage('remove_connection_broadcast', data);
});

AddRequest('get_system_data', function(data) {
    return data.systems.map(function(v) {
        var node = GetNodeByID(v);
        return node ? node : BuildSystemData(v);
    });
});

AddRequest('add_new_system', function(data) {
    var system = GetNodeByID(data.id);
    if (system) return;
    system = BuildSystemData(data.id);
    if (!system) return false;
    system.pos = data.pos;
    return AddSystem(system).then(function() {
        SendNodeUpdate(data.id);
        return true;
    });
});

AddRequest('set_system_corp', function(data) {
    var system = GetNodeByID(data.system);
    if (!system) return false;
    system.corp = data.corp;
    SaveSystemCorporation(system, data.corp);
    SendNodeUpdate(data.system);
})

function GetNodeByID(id) {
    return WNodeList.filter(v => v.id == id).reduce((acc, v) => v, false);
}

function GetConnectionByID(id) {
    return ConnectionList.filter(v => v.id == id).reduce((acc, v) => v, false);
}

export {GetNodeByID, GetConnectionByID};

function SendNodeUpdate(nodeid) {
    var node = GetNodeByID(nodeid);
    if (!node) return;
    BroadcastMessage('node_update', {
        node: node,
        id: nodeid,
        connections: ConnectionList.filter(v => v.nodes.indexOf(nodeid) !== -1),
    });
}

function AddConnection(oldLocation, newLocation, chr) {
    var connection = ConnectionList.filter(v => v.nodes.indexOf(newLocation) !== -1 && v.nodes.indexOf(oldLocation) !== -1);
    if (connection.length > 0) return;
    if (chr) {
        SaveConnectionLog(chr.character_id, oldLocation, newLocation);
    }
    ConnectionList.push({
        id: ConnectionID,
        eol: false,
        size: false,
        mass: 'normal',
        nodes: [oldLocation, newLocation],
        created: Date.now(),
    });
    ConnectionID++;
}

function IsKSpace(system) {
    return ['H', 'L', 'N'].indexOf(system.class) !== -1;
}

import {DoesKJumpExist} from './wormholes';

function CharacterMoved(oldLocation, newLocation, chr) {
    if (DoesKJumpExist(oldLocation, newLocation)) return;
    var newSystem = GetNodeByID(newLocation);
    var oldSystem = GetNodeByID(oldLocation);
    if (!newSystem) {
        newSystem = BuildSystemData(newLocation);
        newSystem.discover = chr.character_name;
        if (!newSystem) {
            console.error("Could not find: " + newLocation);
            return;
        }
        if (!oldSystem && IsKSpace(newSystem)) { // Don't add routes when people spawn in kspace, or travelling through kspace with previous rule.
            return;
        }
        if (oldSystem) {
            newSystem.pos.x = oldSystem.pos.x;
            newSystem.pos.y = oldSystem.pos.y + 40;
            AddConnection(oldLocation, newLocation, chr);
        }
        AddSystem(newSystem).then(SendNodeUpdate);
        SaveSystemLog(chr.character_id, newLocation);
    } else if (oldSystem) {
        AddConnection(oldLocation, newLocation, chr);
        SendNodeUpdate(newLocation);
    }
}
export {CharacterMoved};

function SaveNodes() {
    fs.writeFile('nodes.json', JSON.stringify(GetCurrentNodes()), (err) => err ? console.error(err) : false);
}
setInterval(SaveNodes, 60000);

export default GetCurrentNodes;
