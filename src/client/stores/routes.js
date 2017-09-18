import Store from 'samsio/Store';

const RouteStore = new Store();
RouteStore.updateState({
    defaultSystems: [30000142],
    routes: [],
});

if (localStorage.getItem('default_routes')) {
    RouteStore.updateState({
        defaultSystems: JSON.parse(localStorage.getItem('default_routes')),
    });
}

export default RouteStore;
