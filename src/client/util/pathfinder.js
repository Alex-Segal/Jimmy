import JumpData from '../../../data/jumps';
import NodeStore from '../stores/nodestore';

function GetCurrentPathlist() {
    var jumplist = Object.assign({}, JumpData);
    var connections = NodeStore.getState().connections;
    var connections = [];
    var addjump = function(from, to) {
        if (!jumplist.hasOwnProperty(from)) jumplist[from] = [];
        jumplist[from].push(to);
    };
    connections.forEach(function(v) {
        addjump(v.nodes[0], v.nodes[1]);
        addjump(v.nodes[1], v.nodes[0]);
    });
    return jumplist;
}

function BacktracePath(parentlist, from, to) {
    var path = [to];
    while (path[path.length - 1] != from) {
        path.push(parentlist[path[path.length - 1]]);
    }
    return path.reverse();
}

function FindPath(from, to) {
    var jumplist = GetCurrentPathlist();
    var parentlist = {};
    var s = [];
    var q = [];
    q.push(from);
    while(q.length > 0 && q.length < 500) {
        var c = q.shift();
        if (c == to) {
            return BacktracePath(parentlist, from, to);
        }
        var list = jumplist[c];
        for (var i = 0; i < list.length; i++) {
            var n = list[i];
            if (s.indexOf(n) === -1) {
                parentlist[n] = c;
                s.push(n);
                q.push(n);
            }
        }
    }
    return false;
}

export {FindPath};
