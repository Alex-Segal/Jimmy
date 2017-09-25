import React from 'react';
import Container from 'samsio/Container';
import {CLASS_COLOURS} from '../util/wh_colours';
import NodeStore from '../stores/nodestore';
import {GetNodeByID} from '../stores/nodestore';
import CharacterStore from '../stores/characters';
import RouteStore from '../stores/routes';
import Select from 'react-select';
import {SearchSystems, UpdatePaths, SaveRoutes} from '../actions/routes';
import {UpdateSystem} from '../actions/nodes';

class WormholeStatic extends React.Component {
    render() {
        return <div className="wormhole-static">
            <div className="wormhole-static-name">{this.props.static.name}</div>
            <div className="wormhole-static-class" style={{color: CLASS_COLOURS[this.props.static.security]}}>{this.props.static.security}</div>
        </div>;
    }
}

class CharacterItem extends React.Component {
    render() {
        return <div className="system-character">
            {this.props.character.name}
        </div>;
    }
}

class CharacterList extends React.Component {
    render() {
        return <div className="system-characters">
            <h4>Characters</h4>
            {this.props.characters.filter(v => v && v.location == this.props.system).map(v => <CharacterItem character={v} />)}
        </div>;
    }
}

class CharacterWrap extends React.Component {
    render() {
        return <Container store={CharacterStore}>
            <CharacterList system={this.props.system} />
        </Container>;
    }
}

class WormholeSignaturesType extends React.Component {
    render() {
        if (!this.props.sigs) return false;
        return <div className="wormhole-sigs-type">
            <i className={"fa fa-" + this.props.icon} /><span className="wormhole-sigs-type-count">{this.props.sigs.length}</span>
            <div className="wormhole-sigs-hoverbox">
                <h4>{this.props.type}</h4>
                {this.props.sigs.map(v => <div className="wormhole-sigs-detail">
                    <div className="wormhole-sigs-detail-sig">{v.sig}</div>
                    <div className="wormhole-sigs-detail-site">{v.site}</div>
                </div>)}
            </div>
        </div>;
    }
}

class WormholeSignatures extends React.Component {
    render() {
        if (!this.props.node.sigs) return false; // legacy stuff, shhh
        if (this.props.node.sigs.length <= 0) {
            return <div className="wormhole-sigs">Unscanned</div>
        }
        var groups = this.props.node.sigs.reduce((acc, v) => {
            if (!v.group) {
                acc['Unscanned'].push(v);
                return acc;
            }
            if (!acc.hasOwnProperty(v.group)) acc[v.group] = [];
            acc[v.group].push(v);
            return acc;
        }, {'Unscanned': []});
        return <div className="wormhole-sigs">
            <WormholeSignaturesType icon="times-circle-o" sigs={groups['Wormhole']} type="Wormhole" />
            <WormholeSignaturesType icon="shield" sigs={groups['Combat Site']} type="Combat" />
            <WormholeSignaturesType icon="anchor fa-rotate-180" sigs={groups['Ore Site']} type="Ore" />
            <WormholeSignaturesType icon="server" sigs={groups['Data Site']} type="Data" />
            <WormholeSignaturesType icon="book" sigs={groups['Relic Site']} type="Relic" />
            <WormholeSignaturesType icon="cloud" sigs={groups['Gas Site']} type="Gas" />
            <WormholeSignaturesType icon="question" sigs={groups['Unscanned']} type="Unscanned" />
        </div>;
    }
}

class WormholeSignatureConnection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selecting: false,
        };
    }

    render() {
        var signame = '---';
        if (this.props.sig.connection) {
            signame = GetNodeByID(this.props.sig.connection).nickname;
        }

        if (this.state.selecting) {
            var sigs = this.props.sigs.map(v => v.connection);
            var connections = this.props.connections.filter(v => v.nodes.indexOf(this.props.node.id) !== -1).map(v => {
                if (v.nodes[0] == this.props.node.id) return GetNodeByID(v.nodes[1]);
                if (v.nodes[1] == this.props.node.id) return GetNodeByID(v.nodes[0]);
                return false;
            }).filter(v => ((sigs.indexOf(v.id) === -1) || (v.id == this.props.sig.connection)));
            return <div className="sig-connection">
                <div className="sig-sig">{this.props.sig.sig}</div>
                <div className="sig-select">
                    <Select value={this.props.sig.connection} options={connections.map(v => ({
                            label: v.nickname,
                            value: v.id,
                        }))} onChange={this.selectSig.bind(this)}/>
                </div>
            </div>;
        }

        return <div className="sig-connection">
            <div className="sig-sig">{this.props.sig.sig}</div>
            <span onClick={this.startSelectSig.bind(this)}>{signame}</span>
        </div>;
    }

    selectSig(e) {
        this.setState({
            selecting: false,
        });
        UpdateSystem(this.props.node.id, {
            sig: this.props.sig.sig,
            connection: e ? e.value : false,
        });
    }

    startSelectSig(e) {
        this.setState({
            selecting: true,
        });
    }
}

class WormholeConnections extends React.Component {
    render() {
        if (!this.props.node.sigs) return false; // LEGACY SHITE
        var sigs = this.props.node.sigs.filter(v => v.group == 'Wormhole');
        return <div className="wormhole-connections">
            <h4>Connections</h4>
            {sigs.map(v => (<WormholeSignatureConnection sig={v} sigs={sigs} connections={this.props.connections} node={this.props.node} />))}
        </div>;
    }
}

class WormholeDetail extends React.Component {
    render() {
        var node = this.props.node;

        return <div className="wormhole-detail wormhole-system">
            <h1><span style={{color: CLASS_COLOURS[node.class]}}>{node.class}</span> &nbsp; {node.system} - {node.nickname}</h1>
            {node.effect != '' ? (<h3>{node.effect}</h3>) : false}
            <div className="wormhole-statics">
                <h4>Statics</h4>
                {node.statics.map(v => <WormholeStatic static={v} />)}
            </div>
            <CharacterWrap system={node.id} />
            <WormholeConnections node={node} connections={this.props.connections} />
            <WormholeSignatures node={node} />
        </div>;
    }
}

class RouteItemBox extends React.Component {
    render() {
        return <div className="wormhole-route-box" style={{color: CLASS_COLOURS[this.props.system.class]}} data-col={CLASS_COLOURS[this.props.system.class]} data-name={this.props.system.nickname}>
            {this.props.system.class}
        </div>;
    }
}

class RouteItem extends React.Component {
    render() {
        var fSystem = this.props.route.path.slice(-1)[0];
        return <div className="wormhole-route">
            <div className="wormhole-route-start">{fSystem.system}</div>
            <div className="wormhole-route-length">{this.props.route.path.length}</div>
            <div className="wormhole-boxes">
                {this.props.route.path.map(v => <RouteItemBox system={v} />)}
            </div>
            <div className="wormhole-route-actions">
                <i className="fa fa-times" onClick={this.deleteRoute.bind(this)} />
            </div>
        </div>;
    }

    deleteRoute() {
        RouteStore.updateState({
            defaultSystems: RouteStore.getState().defaultSystems.filter(v => v != this.props.route.to),
        });
        SaveRoutes();
        UpdatePaths();
    }
}

class RouteView extends React.Component {
    render() {
        if (this.props.routes.length <= 0) {
            return <div className="wormhole-route-list">No routes</div>;
        }
        return <div className="wormhole-route-list">
            {this.props.routes.map(v => <RouteItem route={v} />)}
        </div>;
    }
}

class RouteList extends React.Component {
    render() {
        return <Container store={RouteStore}>
            <RouteView />
        </Container>;
    }
}

class RouteActions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newroute: false};
    }

    render() {
        return <div className="wormhole-routes-actions">
            <i className="fa fa-plus" onClick={() => this.setState({newroute: true})} />
            {this.state.newroute ? (<Select.Async loadOptions={this.getOptions} onChange={this.newSystem.bind(this)} clearable={true} />) : false}
        </div>;
    }

    getOptions(input) {
        return SearchSystems(input).then(function(data) {
            return {
                options: data.map(v => ({
                    value: v.id,
                    label: v.name,
                }))
            };
        })
    }

    newSystem(e) {
        if (!e || !e.value) {
            this.setState({
                newroute: false,
            });
            return;
        }
        RouteStore.updateState({
            defaultSystems: RouteStore.getState().defaultSystems.filter(v => v !== e.value).concat([e.value]),
        });
        SaveRoutes();
        this.setState({
            newroute: false,
        });
        UpdatePaths();
    }
}

class WormholeRoutes extends React.Component {
    render() {
        return <div className="wormhole-detail wormhole-routes">
            <h1>Routes</h1>
            <RouteActions />
            <RouteList />
        </div>;
    }
}

class WormholePinPanel extends React.Component {
    render() {
        return <div className="wormhole-detail-pin">
            <i className={"fa fa-thumb-tack" + (this.props.pinpanel ? " active" : " inactive")} onClick={this.togglePin.bind(this)}></i>
        </div>;
    }

    togglePin(e) {
        NodeStore.updateState({pinpanel: !this.props.pinpanel});
    }
}

class WormholeDoubleWrap extends React.Component { // This seems silly at this point
    render() {
        var node = this.props.nodes.filter(v => v.id === this.props.selectedNode);
        if (node.length <= 0) return false;
        return <div className="wormhole-detail-container">
            <WormholeDetail {...this.props} node={node[0]} />
            <WormholeRoutes {...this.props} />
            <WormholePinPanel pinpanel={this.props.pinpanel} />
        </div>;
    }
}

class WormholeWrap extends React.Component {
    render() {
        return <Container store={NodeStore}>
            <WormholeDoubleWrap />
        </Container>;
    }
}

export default WormholeWrap;
