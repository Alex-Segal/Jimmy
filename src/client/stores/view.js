import Store from 'samsio/Store';
import {AddStartupEvent, AddCloseEvent} from '../socket';

const ViewStore = new Store();
ViewStore.updateState({
    online: false,
    characters: false,
    modaltype: false,
    auth: false,
    splash: true,
    authfail: false,
});

AddStartupEvent(function() {
    ViewStore.updateState({
        online: true,
        auth: true,
    });
});

AddCloseEvent(function() {
    ViewStore.updateState({
        online: false,
    });
});

export default ViewStore;
