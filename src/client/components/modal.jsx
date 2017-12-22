import React from 'react';
import Container from 'samsio/Container';
import ViewStore from '../stores/view';
import {LinkCorpModal, NewSystemModal} from './modals';
import SignatureModal from './editor';

class ModalView extends React.Component {
    render() {
        if (!this.props.modaltype) return false;
        var modal = false;
        if (this.props.modaltype == 'new_system') {
            modal = <NewSystemModal />;
        }
        if (this.props.modaltype == 'corporation_link') {
            modal = <LinkCorpModal {...this.props} />;
        }
        if (this.props.modaltype == 'sig') {
            modal = <SignatureModal />;
        }

        return <div className="modal-wrap">
            {modal}
        </div>;
    }
}

class ModalWrap extends React.Component {
    render() {
        return <Container store={ViewStore}>
            <ModalView />
        </Container>;
    }
}

export default ModalWrap;
