import React from 'react';
import {UpdateConnection, RemoveConnection, RemoveSystem, UpdateSystem, AddNodePing, SetSystemWaypoint} from '../actions/nodes';
import ViewStore from '../stores/view';
import NodeStore from '../stores/nodestore';
import {GetNodeByID} from '../stores/nodestore';

class ContextMenuOption extends React.Component {
    render() {
        return <li className="context-menu-option" onClick={this.props.onClick}>
            <i className={"fa fa-" + this.props.icon}></i> {this.props.label}
        </li>;
    }
}

class ContextMenuWaypoint extends React.Component {
    render() {
        var characters = ViewStore.getState().characters;
        if (!characters) return false;
        if (characters.length == 1) {
            return <ContextMenuOption icon="map-pin" label="Set Waypoint" onClick={() => this.props.waypointSingle(characters[0])} />;
        }
        return <ContextMenuSubmenu icon="map-pin" label="Set Waypoint">
            {characters.map(v => <ContextMenuOption icon="street-view" label={v.name} onClick={() => this.props.waypointSingle(v)} />)}
        </ContextMenuSubmenu>;
    }
}

class ContextMenuSystem extends React.Component {
    render() {
        var system = GetNodeByID(this.props.contextSystem);
        return <div className="context-menu" style={{left: this.props.click.x, top: this.props.click.y}}>
            <ul>
                <ContextMenuOption icon="times" label="Remove" onClick={this.handleRemove.bind(this)} />
                <ContextMenuOption icon={system.locked ? "unlock-alt" : "lock"} label={system.locked ? "Unlock System" : "Lock System"} onClick={this.toggleLock.bind(this)} />
                <ContextMenuOption icon="link" label="Add Link" onClick={this.handleAddLink.bind(this)} />
                <ContextMenuSubmenu icon="exclamation-circle" label="Discord Ping">
                    <ContextMenuOption icon="book" label="#intel" onClick={this.intelPing.bind(this)} />
                    <ContextMenuOption icon="exclamation" label="#public_pings" onClick={this.publicPing.bind(this)} />
                    <ContextMenuOption icon="user" label="Just Me" onClick={this.dmPing.bind(this)} />
                </ContextMenuSubmenu>
                <ContextMenuWaypoint waypointSingle={this.waypointSingle.bind(this)} />
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

    handleAddLink(e) {
        NodeStore.updateState({
            linkSystem: this.props.contextSystem,
            contextSystem: false,
        });
    }

    intelPing(e) {
        AddNodePing(this.props.contextSystem, 'intel');
        NodeStore.updateState({contextSystem: false});
    }

    publicPing(e) {
        AddNodePing(this.props.contextSystem, 'public');
        NodeStore.updateState({contextSystem: false});
    }

    dmPing(e) {
        AddNodePing(this.props.contextSystem, 'dm');
        NodeStore.updateState({contextSystem: false});
    }

    waypointSingle(character) {
        SetSystemWaypoint(this.props.contextSystem, character.id);
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

class ContextMenuMap extends React.Component {
    render() {
        return <div className="context-menu" style={{left: this.props.click.x, top: this.props.click.y}}>
            <ul>
                <ContextMenuOption icon="plus" label="Add System" onClick={this.handleNewSystem.bind(this)} />
            </ul>
        </div>;
    }

    handleNewSystem(e) {
        ViewStore.updateState({
            modaltype: 'new_system',
        });
        NodeStore.updateState({
            contextMap: false,
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
            return <ContextMenuSystem {...this.props} />;
        }
        if (this.props.contextMap) {
            return <ContextMenuMap {...this.props} />;
        }
        return false;
    }
}

export default ContextMenu;
