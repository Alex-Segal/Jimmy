import NodeStore from '../stores/nodestore';
import {GetNodeByID} from '../stores/nodestore';
import RequestServer from '../socket';

function RegexToSig(line) {
    var test = /([\w]{3,}-[\d]{3,})\t([^\t]*)\t([^\t]*)\t([^\t]*)[^]*/;
    var sig = test.exec(line);
    if (!sig) return false;
    return {
        sig: sig[1],
        type: sig[2],
        group: sig[3].length > 0 ? sig[3] : false,
        site: sig[4].length > 0 ? sig[4] : false,
    };
}

function ReadSigs(sigdata) {
    var state = NodeStore.getState();
    if (!state.selectedNode) return;
    var sigs = sigdata.split("\n").map(RegexToSig);
    if (sigs.filter(v => v === false).length > 0) return;
    
    RequestServer('update_sigs', {
        sigs: sigs,
        node: state.selectedNode,
    });
}

export default ReadSigs;
