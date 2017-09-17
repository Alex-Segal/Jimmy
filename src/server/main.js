import {AddAction, AddRequest} from './ws';
import GetCurrentNodes from './nodes';
import {CharacterPing} from './characters';

AddRequest('ping', function(data) {
    return CharacterPing(data.key);
});
