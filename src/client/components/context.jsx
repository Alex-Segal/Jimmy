import React from 'react';
import {UpdateConnection, RemoveConnection, RemoveSystem, UpdateSystem} from '../actions/nodes';
import NodeStore from '../stores/nodestore';
import {GetNodeByID} from '../stores/nodestore';

class ContextMenuOption extends React.Component {
    render() {
        return <li className="context-menu-option" onClick={this.props.onClick}>
            <i className={"fa fa-" + this.props.icon}></i> {this.props.label}
        </li>;
    }
}

class ContextMenuSystem extends React.Component {
    render() {
        var system = GetNodeByID(this.props.contextSystem);
        return <div className="context-menu" style={{left: this.props.click.x, top: this.props.click.y}}>
            <ul>
                <ContextMenuOption icon="times" label="Remove" onClick={this.handleRemove.bind(this)} />
                <ContextMenuOption icon={system.locked ? "unlock-alt" : "lock"} label={system.locked ? "Unlock System" : "Lock System"} onClick={this.toggleLock.bind(this)} />
            </ul>
        </div>;
    }

    handleRemove(e) {
        RemoveSystem(this.props.contextSystem);
        NodeStore.updateState({contextSystem: false});
    }

    toggleLock(e) {
        var system = GetNodeByID(this.props.contextSystem);
        UpdateSystem(this.props.contextSystem, {
            locked: !system.locked,
        });
        NodeStore.updateState({contextSystem: false});
    }
}

class ContextMenuConnection extends React.Component {
    render() {
        return <div className="context-menu" style={{left: this.props.click.x, top: this.props.click.y}}>
            <ul>
                <ContextMenuOption icon="clock-o" label="End of Life" onClick={this.handleEOL.bind(this)} />
                <ContextMenuOption icon="star-half-o" label="Frigate" onClick={this.handleFrigate.bind(this)} />
                <ContextMenuOption icon="times" label="Remove" onClick={this.handleRemove.bind(this)} />
            </ul>
        </div>;
    }

    handleEOL(e) {
        UpdateConnection(this.props.contextConnection, {
            eol: true,
        });
        NodeStore.updateState({contextConnection: false});
    }

    handleFrigate(e) {
        UpdateConnection(this.props.contextConnection, {
            frigate: true,
        });
        NodeStore.updateState({contextConnection: false});
    }

    handleRemove(e) {
        RemoveConnection(this.props.contextConnection);
        NodeStore.updateState({contextConnection: false});
    }
}

class ContextMenu extends React.Component {
    render() {
        if (this.props.contextConnection) {
            return <ContextMenuConnection {...this.props} />;
        }
        if (this.props.contextSystem) {
            return <ContextMenuSystem {...this.props} />
        }
        return false;
    }
}

export default ContextMenu;
