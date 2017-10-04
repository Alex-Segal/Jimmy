import {AddAction, AddRequest} from './ws';
import GetCurrentNodes from './nodes';
import {CharacterPing} from './characters';

AddRequest('ping', function(data) {
    if (!data.key) return false;
    return CharacterPing(data.key);
});

import {AddKBNotify} from './zkill';
import {GetNodeByID} from './nodes';
import fetch from 'node-fetch';

AddKBNotify(function(data) {
    var system = GetNodeByID(data.killmail.solar_system_id);
    if (!system) return;
    fetch("http://localhost:8091/kbs/kb", {
        method: 'POST',
        body: JSON.stringify({
            system: system,
            kb: data,
        });
    });
});
