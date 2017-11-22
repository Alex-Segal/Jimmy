import React from 'react';
import Container from 'samsio/Container';
import {CLASS_COLOURS, EFFECT_COLOURS, CORP_STATUS_COLORS} from '../util/wh_colours';
import NodeStore from '../stores/nodestore';
import {GetNodeByID} from '../stores/nodestore';
import CharacterStore from '../stores/characters';
import KBStore from '../stores/kb';
import RouteStore from '../stores/routes';
import Select from 'react-select';
import SystemSelect from '../util/systems';
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

import {GetTimeSince} from '../util/misc';

class WormholeSignatureConnection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selecting: false,
        };
    }

    render() {
        var signame = '---';
        var connection = false;
        if (this.props.sig.connection) {
            signame = GetNodeByID(this.props.sig.connection).nickname;
            connection = this.props.connections.filter(v => (v.nodes.indexOf(this.props.node.id) !== -1) && (v.nodes.indexOf(this.props.sig.connection) !== -1))[0];
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
            {(connection && connection.eol) ? <span className="eol-time">{GetTimeSince(connection.eol)}</span> : false}
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

import WORMHOLE_EFFECTS from '../../../data/effects';
const WORMHOLE_STATS = {
    "C1": 0.15,
    "C2": 0.22,
    "C3": 0.29,
    "C4": 0.36,
    "C5": 0.43,
    "C6": 0.5,
};

function EffectToPercentage(v) {
    return (v > 0 ? "+" : "") + (v * 100) + "%";
}

class WormholeEffectList extends React.Component {
    render() {
        var effectList = WORMHOLE_EFFECTS.filter(v => v.type == this.props.effect)[0];
        if (!effectList) return false;

        return <div className="wormhole-effect-list">
            {effectList.effects.map(v => <div className="wormhole-effect-item">
                <div className={"wormhole-effect-name" + (v.positive ? " positive" : " negative")}>{v.name}</div>
                <div className="wormhole-effect-stat">{EffectToPercentage(WORMHOLE_STATS[this.props.class] * v.scale)}</div>
            </div>)}
        </div>;
    }
}

class WormholeDiscover extends React.Component {
    render() {
        if (!this.props.discover) return false;
        return <div className="wormhole-discover">{this.props.discover}</div>;
    }
}

class WormholeCorp extends React.Component {
    render() {
        if (!this.props.corp) return false;
        return <div className="wormhole-corp" onClick={this.visitzkill.bind(this)} style={{color: CORP_STATUS_COLORS[this.props.corp.status]}}>{this.props.corp.name}</div>;
    }

    visitzkill() {
        window.open("https://zkillboard.com/corporation/" + this.props.corp.id);
    }
}

class WormholeDetail extends React.Component {
    render() {
        var node = this.props.node;

        return <div className="wormhole-detail wormhole-system">
            <h1><span style={{color: CLASS_COLOURS[node.class], marginRight: "30px"}}>{node.class}</span><span className="wormhole-sig" onClick={this.visitDotlan.bind(this)}>{node.system}</span> - {node.nickname}</h1>
            {node.effect != '' ? (<div className="wormhole-effect">
                <h3>{node.effect}</h3>
                <WormholeEffectList class={node.class} effect={node.effect} />
            </div>) : false}
            <WormholeCorp corp={node.corp} />
            <WormholeDiscover discover={node.discover} />
            <div className="wormhole-statics">
                <h4>Statics</h4>
                {node.statics.map(v => <WormholeStatic static={v} />)}
            </div>
            <CharacterWrap system={node.id} />
            <WormholeConnections node={node} connections={this.props.connections} />
            <WormholeSignatures node={node} />
        </div>;
    }

    visitDotlan() {
        window.open("http://evemaps.dotlan.net/system/" + this.props.node.system);
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
            <RouteActions />
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
            <i className="fa fa-plus" onClick={() => this.setState({newroute: true})} /><span> </span>
            <i className={"fa fa-paper-plane" + (this.props.frigates ? " active" : " inactive")} onClick={this.toggleFrigateRoute.bind(this)} />
            <i className={"fa fa-ship" + (this.props.cruisers ? " active" : " inactive")} onClick={this.toggleCruiserRoute.bind(this)} />
            {this.state.newroute ? (<SystemSelect onChange={this.newSystem.bind(this)} />) : false}
        </div>;
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

    toggleFrigateRoute(e) {
        RouteStore.updateState({
            frigates: !RouteStore.getState().frigates,
        });
        UpdatePaths();
    }

    toggleCruiserRoute(e) {
        RouteStore.updateState({
            cruisers: !RouteStore.getState().cruisers,
        });
        UpdatePaths();
    }
}

import {PrettyNumber} from '../util/misc';

class WormholeKillmail extends React.Component {
    render() {
        var timest = new Date(this.props.km.killmail.killmail_time);
        return <div className="wormhole-killmail" onClick={this.gozkill.bind(this)}>
            <div className="wormhole-killmail-picture"><img src={"https://eve.genj.io/imgs/renders/" + this.props.km.killmail.victim.ship_type_id + ".png"} /></div>
            <div className="wormhole-killmail-isk">{PrettyNumber(this.props.km.zkb.totalValue)} isk</div>
            <div className="wormhole-killmail-time">{GetTimeSince(timest)} ago</div>
        </div>;
    }

    gozkill() {
        window.open("https://zkillboard.com/kill/" + this.props.km.killmail.killmail_id + "/", "_blank");
    }
}

class WormholeKillmailView extends React.Component {
    render() {
        if (this.props.kms.length <= 0) {
            return <div><h1>Killmails</h1><p>No kills in system within 24hrs</p></div>;
        }
        return <div>
            <h1>Killmails</h1>
            <div className="wormhole-killmail-list">
                {this.props.kms.map(v => <WormholeKillmail km={v} key={v.killID} />)}
            </div>
        </div>;
    }
}

class WormholeKillboard extends React.Component {
    render() {
        return <Container store={KBStore}>
            <WormholeKillmailView />
        </Container>;
    }
}

class WormholeRoutes extends React.Component {
    render() {
        return <div className="wormhole-detail wormhole-routes">
            <h1>Routes</h1>
            <RouteList />
            <WormholeKillboard />
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

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.transform === this.props.transform) {
            return true;
        }
        return false;
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
