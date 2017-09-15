import Store from 'samsio/Store';
import {RequestServer, AddStartupEvent, AddBroadcastListen} from '../socket';

const CharacterStore = new Store();
CharacterStore.updateState({
    characters: [],
});

AddStartupEvent(function() {
    RequestServer('get_characters', {}).then(function(data) {
        CharacterStore.updateState({
            characters: data,
        });
    });
});

AddBroadcastListen('update_character', function(data) {
    CharacterStore.updateState({
        CharacterStore.getState().characters.filter(v => v.id != data.id).concat([data]),
    });
});

export default CharacterStore;
