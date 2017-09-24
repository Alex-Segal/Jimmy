import RouteStore from '../stores/routes';
import NodeStore from '../stores/nodestore';
import {FindPath} from '../util/pathfinder';
import {RequestServer} from '../socket';

function UpdatePaths() {
    RouteStore.updateState({
        routes: [],
    });

    var systems = RouteStore.getState().defaultSystems;
    var selected = NodeStore.getState().selectedNode;
    if (!selected) return;

    var paths = systems.map(v => ({
        path: FindPath(selected, v),
        from: selected,
        to: v,
    })); // could be pretty expensive
    paths.forEach(function(v) {
        if (!v.path) return;
        RequestServer('get_system_data', {systems: v.path}).then(function(data) {
            var pathobj = {
                to: v.to,
                path: data,
            };
            RouteStore.updateState({
                routes: RouteStore.getState().routes.concat([pathobj]),
            });
        });
    });
}
export {UpdatePaths};

function SearchSystems(query) {
    return RequestServer('search_systems', query);
}

export {SearchSystems};

function SaveRoutes() {
    localStorage.setItem('default_routes', JSON.stringify(RouteStore.getState().defaultSystems));
}

export {SaveRoutes};
