import fetch from 'node-fetch';
import {CharacterMoved} from './nodes';
import {BroadcastMessage, AddRequest} from './ws';

var CHARACTERS = [];

function CharacterPing(key) {
    var character = CHARACTERS.filter(v => v.key == key);
    if (character.length <= 0) {
        CHARACTERS.push({
            key: key,
            character: false,
            location: false,
            updated: Date.now(),
        });
        return;
    }

    character = character[0];
    character.updated = Date.now();
    return GetLocalCharacter(character);
}

function GetLocalCharacter(v) {
    if (!v.character) return false;
    return {
        name: v.character.character_name,
        id: v.character.character_id,
        location: v.location,
    };
}

function GetLocalCharacters() {
    return CHARACTERS.map(GetLocalCharacter);
}

AddRequest('get_characters', function(data) {
    return GetLocalCharacters();
});

function RefreshCharacter(key) {
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
    CHARACTERS.map(function(chr) {
        if (chr.updated < (Date.now() - 60000)) return;
        var chain = RefreshCharacter(chr.key).then(function(data) {
            if (data.hasOwnProperty('error')) {
                return Promise.reject('No auth');
            }
            chr.character = data;
            return data;
        }).catch(function() {
            // TODO: Send a message to the client, keep connection in character array?
        });

        if (!chr.character) return;
        chain.then(GetCharacterLocation).then(function(location) {
            if (location.solar_system_id != chr.location) {
                CharacterMoved(chr.location, location.solar_system_id);
                chr.location = location.solar_system_id;
                BroadcastMessage('update_character', GetLocalCharacter(chr));
            }
        });
    });
}

setInterval(CharacterLocationLoop, 6000);

export {CharacterPing};
