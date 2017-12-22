import React from 'react';
import ReactSelect from 'react-select';
import Container from 'samsio/Container';
import siglist from '../../../data/sigs';
import NodeStore from '../stores/nodestore';
import {ModalBase} from './modals';

const SIG_GROUPS = [
    'Wormhole',
    'Combat Site',
    'Ore Site',
    'Data Site',
    'Relic Site',
    'Gas Site',
];

class SignatureRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
        };
    }

    getOptions() {
        return siglist
            .filter(v => v.type == this.props.sig.group && (v.class == this.props.class || v.class == 'all'))
            .map(v => ({
                label: v.site,
                value: v.site,
            }));
    }

    render() {
        if (this.state.editing) {
            console.log(this.getOptions());
            return <tr>
                <td><input type="text" value={this.props.sig.sig} onChange={this.editSig.bind(this)}/></td>
                <td><ReactSelect options={SIG_GROUPS.map(v => ({label: v, value: v}))} value={this.props.sig.group} onChange={this.editGroup.bind(this)}/></td>
                <td><ReactSelect options={this.getOptions()} value={this.props.sig.site} onChange={this.editSite.bind(this)} /></td>
                <td><i className="fa fa-check" onClick={this.submitRow.bind(this)} /></td>
            </tr>;
        }
        return <tr onClick={() => this.setState({editing: true})}>
            <td>{this.props.sig.sig}</td>
            <td>{this.props.sig.group}</td>
            <td>{this.props.sig.site}</td>
            <td></td>
        </tr>;
    }

    editSig(e) {
        console.log(e);
    }

    editGroup(e) {
        console.log(e);
    }

    editSite(e) {
        console.log(e);
    }

    submitRow() {
        this.setState({
            editing: false,
        });
    }
}

class SignatureEditor extends ModalBase {
    getTitle() {
        return 'Signature Editor';
    }

    getContents() {
        var [node] = this.props.nodes.filter(v => v.id == this.props.selectedNode);
        if (!node) return false;
        return <table className="signature-table">
            <thead>
                <tr>
                    <th>Sig</th>
                    <th>Group</th>
                    <th>Site</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {node.sigs.map(v => <SignatureRow sig={v} class={node.class} key={v.sig} />)}
            </tbody>
        </table>
    }
}

class SignatureWrap extends React.Component {
    render() {
        return <Container store={NodeStore}>
            <SignatureEditor />
        </Container>;
    }
}

export default SignatureWrap;
