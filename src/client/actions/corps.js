import {RequestServer} from '../socket';

function GetCorpIDs(search) {
    return fetch("https://esi.tech.ccp.is/latest/search/?categories=corporation&search=" + encodeURIComponent(search), {
        headers: {
            'Accept': 'application/json',
        },
        method: 'GET',
    }).then(r => r.json());
}

function GetCorpList(ids) {
    if (ids.length > 10) ids = ids.slice(0, 10);
    return fetch("https://esi.tech.ccp.is/latest/universe/names/", {
        headers: {
            'Accept': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(ids),
    }).then(r => r.json());
}

function GetCorpSearch(search) {
    return GetCorpIDs(search).then(r => r.corporation).then(GetCorpList);
}

function SetSystemCorp(system, corp) {
    RequestServer('set_system_corp', {
        system: system,
        corp: corp,
    });
}

export {GetCorpSearch, SetSystemCorp};
