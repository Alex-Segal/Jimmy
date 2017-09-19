import React from 'react';
import Container from 'samsio/Container';
import CLASS_COLOURS from '../util/wh_colours';
import NodeStore from '../stores/nodestore';
import CharacterStore from '../stores/characters';
import RouteStore from '../stores/routes';
import Select from 'react-select';
import {SearchSystems, UpdatePaths} from '../actions/routes';

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

const SIG_START = {
    'Wormhole': 0,
    'Combat Site': 0,
    'Ore Site': 0,
    'Data Site': 0,
    'Relic Site': 0,
    'Gas Site': 0,
    'Unscanned': 0,
};

class WormholeSignatures extends React.Component {
    render() {
        if (!this.props.node.sigs) return false; // legacy stuff, shhh
        if (this.props.nodes.sigs.length <= 0) {
            return <div className="wormhole-sigs">Unscanned</div>
        }
        var groups = this.props.node.sigs.reduce((acc, v) => {
            if (!v.group) {
                acc['Unscanned']++;
                return acc;
            }
            acc[v.group]++;
            return acc;
        }, Object.assign({}, SIG_START));
        return <div className="wormhole-sigs">
            <i className="fa fa-times-circle-o" />{groups['Wormhole']}
            <i className="fa fa-shield" />{groups['Combat Site']}
            <i className="fa fa-anchor fa-rotate-180" />{groups['Ore Site']}
            <i className="fa fa-server" />{groups['Data Site']}
            <i className="fa fa-book" />{groups['Relic Site']}
            <i className="fa fa-cloud" />{groups['Gas Site']}
        </div>;
    }
}

class WormholeDetail extends React.Component {
    render() {
        var node = this.props.nodes.filter(v => v.id === this.props.selectedNode);
        if (node.length <= 0) return false;
        node = node[0];

        return <div className="wormhole-detail wormhole-system">
            <h1>{node.system} - {node.nickname}</h1>
            <h2 style={{color: CLASS_COLOURS[node.class]}}>{node.class}</h2>
            {node.effect != '' ? (<h3>{node.effect}</h3>) : false}
            <div className="wormhole-statics">
                <h4>Statics</h4>
                {node.statics.map(v => <WormholeStatic static={v} />)}
            </div>
            <CharacterWrap system={node.id} />
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
        this.setState({
            newroute: false,
        });
        UpdatePaths();
    }
}

class WormholeRoutes extends React.Component {
    render() {
        var node = this.props.nodes.filter(v => v.id === this.props.selectedNode);
        if (node.length <= 0) return false;
        return <div className="wormhole-detail wormhole-routes">
            <h1>Routes</h1>
            <RouteActions />
            <RouteList />
        </div>;
    }
}

class WormholeWrap extends React.Component {
    render() {
        return <Container store={NodeStore}>
            <WormholeDetail />
            <WormholeRoutes />
        </Container>;
    }
}

export default WormholeWrap;
