import React from 'react';
import Container from 'samsio/Container';
import CLASS_COLOURS from '../util/wh_colours';
import NodeStore from '../stores/nodestore';

class WormholeStatic extends React.Component {
    render() {
        return <div className="wormhole-static">
            <div className="wormhole-static-name">{this.props.static.name}</div>
            <div className="wormhole-static-class" style={{color: CLASS_COLOURS[this.props.static.security]}}>{this.props.static.security}</div>
        </div>;
    }
}

class WormholeDetail extends React.Component {
    render() {
        var node = this.props.nodes.filter(v => v.id === this.props.selectedNode);
        if (node.length <= 0) return false;
        node = node[0];

        return <div className="wormhole-detail">
            <h1>{node.system} - {node.nickname}</h1>
            <h2 style={{color: CLASS_COLOURS[node.class]}}>{node.class}</h2>
            <h3>{node.effect}</h3>
            <div className="wormhole-statics">
                {node.statics.map(v => <WormholeStatic static={v} />)}
            </div>
        </div>;
    }
}

class WormholeWrap extends React.Component {
    render() {
        return <Container store={NodeStore}>
            <WormholeDetail />
        </Container>;
    }
}

export default WormholeWrap;
