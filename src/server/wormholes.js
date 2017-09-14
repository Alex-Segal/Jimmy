import Jumps from '../../data/jumps';
import Statics from '../../data/statics';
import Systems from '../../data/systems';
import Wormholes from '../../data/wormholes';

function GetClassString(system) {
    if (system.system_security > 0.5) return 'H';
    if (system.system_security > 0) return 'L';
    if (system.system_security > -0.95) return 'N';
    return "C" + system.security;
}

function BuildSystemData(systemId) {
    var system = Systems.filter(v => v.system_id == systemId);
    if (system.length <= 0) return false;
    system = system[0];

    var statics = Statics.hasOwnProperty(system.constellation_id) ? Statics[system.constellation_id] : [];
    statics = statics.map(v => Wormholes.filter(w => w.id == v)[0]);

    return {
        id: system.system_id,
        system: system.system_name,
        class: GetClassString(system),
        region: system.region_name,
        statics: statics,
        effect: system.effect,
        pos: {x: 0, y: 0},
        nickname: "Unnamed",
    };
}

export default BuildSystemData;
