import {AddAction, AddRequest} from './ws';
import GetCurrentNodes from './nodes';
import {CharacterPing} from './characters';

AddRequest('ping', function(data) {
    CharacterPing(data.key);
    return true;
});
