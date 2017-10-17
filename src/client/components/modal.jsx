import React from 'react';
import Select from 'react-select';
import Container from 'samsio/Container';
import {AddNewSystem} from '../actions/nodes';
import NodeStore from '../stores/nodestore';
import ViewStore from '../stores/view';
import SystemSelect from '../util/systems';

class ModalBase extends React.Component {
    render() {
        return <div className="modal-dialogue">
            <div className="modal-title">
                <i className={"fa fa-" + this.getIcon()} />
                <h3>{this.getTitle()}</h3>
            </div>
            <div className="modal-content">
                {this.getContents()}
            </div>
            <div className="modal-footer">
                {this.getButtons()}
                <div className="modal-button" onClick={this.handleCancel.bind(this)}>Cancel</div>
            </div>
        </div>;
    }

    handleCancel(e) {
        ViewStore.updateState({
            modaltype: false,
        });
    }

    getIcon() {
        return 'plus';
    }

    getTitle() {
        return 'Test';
    }

    getContents() {
        return 'Test';
    }

    getButtons() {
        return false;
    }
}

class LinkCorpModal extends ModalBase {
    getIcon() {
        return 'certificate';
    }

    getContents() {
        return <div>
            <Select.Async loadOptions={this.getOptions} onChange={this.selectCorp.bind(this)} value={this.state.corp} />
        </div>;
    }

    getOptions(input) {
        
    }
}

class NewSystemModal extends ModalBase {
    getTitle() {
        return 'New System';
    }

    getContents() {
        return <SystemSelect onChange={this.selectSystem.bind(this)} />;
    }

    selectSystem(e) {
        ViewStore.updateState({
            modaltype: false,
        });
        var state = NodeStore.getState();
        AddNewSystem(e.value, state.transform.inversePoint(state.click.x, state.click.y));
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
