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

class ContextMenuSubmenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    render() {
        return <div className="context-sub-menu-box">
            <ContextMenuOption icon={this.props.icon} label={this.props.label} onClick={this.openMenu.bind(this)} />
            {this.state.open ? (<div className="context-sub-menu">{this.props.children}</div>) : false}
        </div>;
    }

    openMenu(e) {
        this.setState({
            open: true,
        });
    }
}

class ContextMenuConnection extends React.Component {
    render() {
        return <div className="context-menu" style={{left: this.props.click.x, top: this.props.click.y}}>
            <ul>
                <ContextMenuOption icon="clock-o" label="End of Life" onClick={this.handleEOL.bind(this)} />
                <ContextMenuOption icon="paper-plane" label="Frigate" onClick={this.handleFrigate.bind(this)} />
                <ContextMenuOption icon="times" label="Remove" onClick={this.handleRemove.bind(this)} />
                <ContextMenuSubmenu icon="space-shuttle" label="Update Mass" >
                    <ContextMenuOption icon="star" label="Full Mass" onClick={this.handleFullMass.bind(this)} />
                    <ContextMenuOption icon="star-half-o" label="Reduced" onClick={this.handleReduced.bind(this)} />
                    <ContextMenuOption icon="star-o" label="Critical" onClick={this.handleCritical.bind(this)} />
                </ContextMenuSubmenu>
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

    handleFullMass(e) {
        UpdateConnection(this.props.contextConnection, {
            mass: 'normal',
        });
        NodeStore.updateState({contextConnection: false});
    }

    handleReduced(e) {
        UpdateConnection(this.props.contextConnection, {
            mass: 'reduced',
        });
        NodeStore.updateState({contextConnection: false});
    }

    handleCritical(e) {
        UpdateConnection(this.props.contextConnection, {
            mass: 'critical',
        });
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
