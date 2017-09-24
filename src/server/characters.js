import fetch from 'node-fetch';
import {CharacterMoved} from './nodes';
import {BroadcastMessage, AddRequest} from './ws';

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

function RefreshConnection(key) {
    return fetch("http://localhost:8091/character/access?key=" + key, {
        method: 'GET',
    }).then(r => r.json());
}

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
    CONNECTIONS.map(function(conn) {
        if (conn.updated < (Date.now() - 60000)) return;
        var chain = RefreshConnection(conn.key).then(function(data) {
            if (data.hasOwnProperty('error')) {
                console.error('no auth' + data.error);
                return Promise.reject('No auth');
            }
            if (conn.character) {
                conn.character = conn.character.map(v => Object.assign(v, {
                    access_token: data.filter(c => c.character_id = v.character_id)[0].access_token
                }));
                console.log(data);
                console.log(conn.character);
            } else {
                conn.character = data;
            }
            return data;
        }).catch(function(e) {
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
                        CharacterMoved(chr.location, location.solar_system_id);
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
