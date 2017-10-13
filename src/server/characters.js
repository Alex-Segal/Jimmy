import fetch from 'node-fetch';
import {RefreshConnection} from './auth';
import {CharacterMoved} from './nodes';
import {BroadcastMessage, AddRequest, RemoveKey} from './ws';

var CONNECTIONS = [];

function CharacterPing(key) {
    var connection = CONNECTIONS.filter(v => v.key == key);
    if (connection.length <= 0) {
        CONNECTIONS.push({
            key: key,
            character: false,
            updated: Date.now(),
        });
        return;
    }

    connection = connection[0];
    connection.updated = Date.now();
    return connection.character ? connection.character.map(GetLocalCharacter) : false;
}

function GetConnectionByKey(key) {
    return CONNECTIONS.filter(v => v.key == key)[0];
}

export {GetConnectionByKey};

function GetLocalCharacter(v) {
    return {
        name: v.character_name,
        id: v.character_id,
        location: v.location,
    };
}

function GetLocalCharacters() {
    return CONNECTIONS.reduce((acc, v) => v.character ? acc.concat(v.character) : acc, []).map(GetLocalCharacter);
}

AddRequest('get_characters', function(data) {
    return GetLocalCharacters();
});

AddRequest('set_waypoint', function(data, ws, key) {
    var connection = GetConnectionByKey(key);
    if (!connection || !connection.character) return;
    var char = connection.character.filter(v => v.character_id == data.character)[0];
    if (!char) return;
    fetch("https://esi.tech.ccp.is/latest/ui/autopilot/waypoint/?destination_id=" + data.system, {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + char.access_token,
        },
        method: 'POST',
    }).then(r => r.json()).then(function(r) {
        if (r.hasOwnProperty('error')) {
            throw r.error;
        }
    }).catch(function(e) {
        console.error(e);
    });
});

function GetCharacterLocation(character) {
    return fetch("https://esi.tech.ccp.is/latest/characters/" + character.character_id + "/location",{
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + character.access_token,
        },
        method: 'GET',
    }).then(r => r.json());
}

function CharacterLocationLoop() {
    CONNECTIONS = CONNECTIONS.filter(v => v.updated > (Date.now() - 60000));
    CONNECTIONS.map(function(conn) {
        var chain = RefreshConnection(conn.key).then(function(data) {
            if (data.hasOwnProperty('error') || data.length <= 0) {
                console.error('no auth' + data.error);
                throw 'no auth';
            }
            if (conn.character) {
                conn.character = conn.character.map(v => Object.assign(v, {
                    access_token: data.filter(c => c.character_id == v.character_id)[0].access_token
                }));
            } else {
                conn.character = data;
            }
            return data;
        }).catch(function(e) {
            RemoveKey(conn.key);
            console.error(['conn', e]);
            // TODO: Send a message to the client, keep connection in character array?
        });

        if (!conn.character) return;

        chain.then(function(data) {
            conn.character.forEach(function(chr) {
                GetCharacterLocation(chr).then(function(location) {
                    if (!location.hasOwnProperty('solar_system_id')) {
                        console.error(['location', location]);
                        return;
                    }

                    if (location.solar_system_id != chr.location) {
                        CharacterMoved(chr.location, location.solar_system_id, chr);
                        chr.location = location.solar_system_id;
                        BroadcastMessage('update_character', GetLocalCharacter(chr));
                    }
                });
            });
        });
    });
}

setInterval(CharacterLocationLoop, 6000);

export {CharacterPing};
