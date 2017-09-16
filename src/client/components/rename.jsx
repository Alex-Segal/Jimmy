import React from 'react';
import {UpdateSelectedName} from '../actions/nodes';

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
        var point = this.props.transform.inversePoint(node.pos.x, node.pos.y);
        return <input style={{left: point.x, top: point.y}} value={this.state.nickname} ref={input => {this.renameBox = input;}} onChange={this.handleChange.bind(this)} onKeyUp={this.handleKeyUp.bind(this)}/>;
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

export default RenameBox;
