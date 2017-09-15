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
    for (var i=0; i < CHARACTERS.length; i++) {
        var character = CHARACTERS[i];
        if (character.updated < (Date.now() - 60000)) continue;
        var chain = RefreshCharacter(character.key).then(function(data) {
            character.character = data;
            return data;
        });

        if (!character.character) continue;
        chain.then(GetCharacterLocation).then(function(location) {
            if (location.solar_system_id != character.location) {
                CharacterMoved(character.location, location.solar_system_id);
                character.location = location.solar_system_id;
                BroadcastMessage('update_character', GetLocalCharacter(character));
            }
        });
    }
}

setInterval(CharacterLocationLoop, 6000);

export {CharacterPing};
