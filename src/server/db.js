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

process.on('exit', function() {
    sqldb.close();
});
