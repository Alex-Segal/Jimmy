import fetch from 'node-fetch';

function RefreshConnection(key) {
    if (key == false) throw "no auth";
    return fetch("http://localhost:8091/character/access?key=" + key, {
        method: 'GET',
    }).then(r => r.json());
}

export {RefreshConnection};
