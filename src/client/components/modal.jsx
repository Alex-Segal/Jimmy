import React from 'react';
import Container from 'samsio/Container';
import {AddNewSystem} from '../actions/nodes';
import NodeStore from '../stores/nodestore';
import ViewStore from '../stores/view';
import SystemSelect from '../util/systems';

class NewSystemModal extends React.Component {
    render() {
        return <div className="modal-dialogue">
            <div className="modal-title">
                <i className="fa fa-plus" />
                <h3>New System</h3>
            </div>
            <div className="modal-content">
                <SystemSelect onChange={this.selectSystem.bind(this)} />
            </div>
            <div className="modal-footer">
                <div className="modal-button" onClick={this.handleCancel.bind(this)}>Cancel</div>
            </div>
        </div>;
    }

    selectSystem(e) {
        ViewStore.updateState({
            modaltype: false,
        });
        var state = NodeStore.getState();
        AddNewSystem(e.value, state.transform.inversePoint(state.click.x, state.click.y));
    }

    handleCancel(e) {
        ViewStore.updateState({
            modaltype: false,
        });
    }
}

class ModalView extends React.Component {
    render() {
        if (!this.props.modaltype) return false;
        var modal = false;
        if (this.props.modaltype == 'new_system') {
            modal = <NewSystemModal />;
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
