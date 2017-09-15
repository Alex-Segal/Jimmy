import React from 'react';
import NodeStore from '../stores/nodestore';
import {UpdateSelectedName} from '../actions/nodes';
import Container from 'samsio/Container';

class RenameBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
        };
    }

    componentDidUpdate() {
        if (this.renameBox) {
            this.renameBox.focus();
        }
    }

    render() {
        if (!this.props.renamingNode) return false;
        var node = this.props.nodes.filter(v => v.id === this.props.selectedNode);
        if (node.length <= 0) return false;
        node = node[0];

        return <input style={{left: node.pos.x + this.props.panoffset.x, top: node.pos.y + this.props.panoffset.y}} value={this.state.nickname} ref={input => {this.renameBox = input;}} onChange={this.handleChange.bind(this)} onKeyUp={this.handleKeyUp.bind(this)}/>;
    }

    handleChange(e) {
        this.setState({nickname: e.target.value});
    }

    handleKeyUp(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            UpdateSelectedName(this.state.nickname);
            this.setState({
                nickname: '',
            });
        }
    }
}

class RenameWrap extends React.Component {
    render() {
        return <Container store={NodeStore}>
            <RenameBox />
        </Container>;
    }
}

export default RenameWrap;
