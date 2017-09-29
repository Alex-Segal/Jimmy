import fetch from 'node-fetch';
import {AddKey, AddRequest} from './ws';

function RefreshConnection(key) {
    if (key == false) return Promise.reject('no auth');
    return fetch("http://localhost:8091/character/access?key=" + key, {
        method: 'GET',
    }).then(r => r.json());
}

AddRequest('auth', function(data) {
    return RefreshConnection(data.key).then(function(auth) {
        if (auth.hasOwnProperty('error')) throw "no auth";
        if (auth.length <= 0) throw "no auth";
        AddKey(data.key);
        return {success: true};
    }).catch(function(e) {
        return {error: e};
    });
});

export {RefreshConnection};
