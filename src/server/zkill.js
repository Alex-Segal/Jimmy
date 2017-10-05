import fetch from 'node-fetch';
import {AddRequest} from './ws';

var LOCAL_KBS = [];
const NotifyKBs = [];

function GetNewKB() {
    return fetch("https://redisq.zkillboard.com/listen.php", {
        headers: {
            'Accept': 'application/json',
        },
        method: 'GET',
    }).then(r => r.json()).then(function(data) {
        if (!data.package) return;
        LOCAL_KBS.push(data.package);
        NotifyKBs.forEach(v => v(data.package));
    }).catch(function(e) {
        console.error('Killboard RedisQ Error');
        console.error(e);
    });
}

async function KBLoop() {
    while(true) {
        await GetNewKB();
    }
}

KBLoop();

function AddKBNotify(callable) {
    NotifyKBs.push(callable);
}

export {AddKBNotify};

setInterval(function() {
    LOCAL_KBS = LOCAL_KBS.filter(function(v) {
        var time = (new Date(v.killmail.killmail_time)).getTime();
        return time > Date.now() - (24*60*60*1000);
    });
}, 86400000);

function GetKBsSystem(system_id) {
    return LOCAL_KBS.filter(v => v.killmail.solar_system_id == system_id);
}

export {GetKBsSystem};

AddRequest('get_killboard', function(data) {
    return GetKBsSystem(data.system);
});
