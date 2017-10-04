import KBStore from '../stores/kb';
import NodeStore from '../stores/nodestore';
import {RequestServer} from '../socket';

function UpdateKillmails() {
    var selected = NodeStore.getState().selectedNode;
    KBStore.updateState({
        kms: [],
    });
    if (!selected) return;

    RequestServer('get_killboard', {system: selected}).then(function(data) {
        KBStore.updateState({
            kms: data,
        });
    });
}

export {UpdateKillmails};
