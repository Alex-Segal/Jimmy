function GetCorpIDs(search) {
    return fetch("https://esi.tech.ccp.is/latest/search/?categories=corporation&search=" + encodeURIComponent(search), {
        headers: {
            'Accept': 'application/json',
        },
        method: 'GET',
    }).then(r => r.json());
}

function GetCorpList(ids) {
    return fetch("https://esi.tech.ccp.is/latest/corporations/names/")
}
