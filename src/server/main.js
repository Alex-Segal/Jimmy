import {AddAction, AddRequest} from './ws';
import GetCurrentNodes from './nodes';
import {CharacterPing} from './characters';

AddRequest('ping', function(data) {
    if (!data.key) return false;
    return CharacterPing(data.key);
});
