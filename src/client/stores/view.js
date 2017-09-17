import Store from 'samsio/Store';
import {AddStartupEvent, AddCloseEvent} from '../socket';

const ViewStore = new Store();
ViewStore.updateState({
    online: false,
    character_id: false,
    character_name: false,
});

AddStartupEvent(function() {
    ViewStore.updateState({
        online: true,
    });
});

AddCloseEvent(function() {
    ViewStore.updateState({
        online: false,
    });
});

export default ViewStore;
