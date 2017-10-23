import React from 'react';
import Select from 'react-select';
import Container from 'samsio/Container';
import {AddNewSystem} from '../actions/nodes';
import {GetCorpSearch, SetSystemCorp} from '../actions/corps';
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
    constructor(props) {
        super(props);
        this.state = {
            corp: false,
            status: false,
        };
    }

    getIcon() {
        return 'certificate';
    }

    getTitle() {
        return 'Corporation';
    }

    getButtons() {
        return <div className="modal-button" style={{backgroundColor: "#389838"}} onClick={this.submitCorp.bind(this)}>Submit</div>
    }

    getContents() {
        return <div>
            <Select.Async loadOptions={this.getOptions} onChange={this.selectCorp.bind(this)} value={this.state.corp} cache={false} filterOption={() => true} />
            <div className="corporation-status">
                <label>
                    <input type="radio" value="friendly" checked={this.state.status == 'friendly'} onChange={this.handleCorpStatus.bind(this)} />
                    Friendly
                </label>
                <label>
                    <input type="radio" value="neutral" checked={this.state.status == 'neutral'} onChange={this.handleCorpStatus.bind(this)} />
                    Neutral
                </label>
                <label>
                    <input type="radio" value="hostile" checked={this.state.status == 'hostile'} onChange={this.handleCorpStatus.bind(this)} />
                    Hostile
                </label>
            </div>
        </div>;
    }

    submitCorp(e) {
        SetSystemCorp(this.props.systemCorp, {
            name: this.state.corp.label,
            id: this.state.corp.value,
            status: this.state.status,
        });
        ViewStore.updateState({
            modaltype: false,
        });
    }

    getOptions(input) {
        if (input.length <= 3) return Promise.resolve([]);
        return GetCorpSearch(input).then(r => r.map(v => ({value: v.corporation_id, label: v.corporation_name}))).then(function(d) {
            return {options: d, complete: false};
        });
    }

    selectCorp(e) {
        this.setState({
            corp: e,
        });
    }

    handleCorpStatus(e) {
        this.setState({
            status: e.target.value,
        });
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
        if (this.props.modaltype == 'corporation_link') {
            modal = <LinkCorpModal {...this.props} />;
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
