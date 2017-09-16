import React from 'react';
import Container from 'samsio/Container';
import CLASS_COLOURS from '../util/wh_colours';
import NodeStore from '../stores/nodestore';
import CharacterStore from '../stores/characters';

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

class WormholeDetail extends React.Component {
    render() {
        var node = this.props.nodes.filter(v => v.id === this.props.selectedNode);
        if (node.length <= 0) return false;
        node = node[0];

        return <div className="wormhole-detail wormhole-system">
            <h1>{node.system} - {node.nickname}</h1>
            <h2 style={{color: CLASS_COLOURS[node.class]}}>{node.class}</h2>
            <h3>{node.effect}</h3>
            <div className="wormhole-statics">
                <h4>Statics</h4>
                {node.statics.map(v => <WormholeStatic static={v} />)}
            </div>
            <CharacterWrap system={node.id} />
        </div>;
    }
}

class WormholeRoutes extends React.Component {
    render() {
        var node = this.props.nodes.filter(v => v.id === this.props.selectedNode);
        if (node.length <= 0) return false;
        return <div className="wormhole-detail wormhole-routes">
            <h1>Routes</h1>
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
