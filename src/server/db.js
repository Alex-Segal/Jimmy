import sqlite3 from 'sqlite3';
const sqldb = new sqlite3.Database('./store.db');

function SaveSystem(id, system, name) {
    var stmt = sqldb.prepare('REPLACE INTO systems(id, system, name) VALUES (?, ?, ?)');
    stmt.run(id, system, name);
    stmt.finalize();
}

function SaveSystemPing(id, discord_id, target) {
    var stmt = sqldb.prepare('INSERT INTO pings(system, discord, target) VALUES(?, ?, ?)');
    stmt.run(id, discord_id, target);
    stmt.finalize();
}

export {SaveSystem, SaveSystemPing};

const GetPingQuery = `SELECT pings.discord, pings.target, systems.name, systems.system
FROM pings
INNER JOIN systems ON systems.id = pings.system
WHERE systems.id = ?`;

function GetPings(system) {
    return new Promise((resolve, reject) => {
        sqldb.all(GetPingQuery, system, function(err, row) {
            if (row.length <= 0) {
                reject();
                return;
            }
            resolve(row);
        });
    });
}

export {GetPings};

function SaveSystemLog(character_id, system_id) {
    var stmt = sqldb.prepare('INSERT INTO system_log(time, character_id, system_id) VALUES (?, ?, ?)');
    stmt.run(Date.now(), character_id, system_id);
    stmt.finalize();
}

function SaveConnectionLog(character_id, system_id_from, system_id_to) {
    var stmt = sqldb.prepare('INSERT INTO connection_log(time, character_id, system_id_from, system_id_to) VALUES(?, ?, ?, ?)');
    stmt.run(Date.now(), character_id, system_id_from, system_id_to);
    stmt.finalize();
}

export {SaveSystemLog, SaveConnectionLog};

process.on('exit', function() {
    sqldb.close();
});
