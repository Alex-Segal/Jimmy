import React from 'react';
import Container from 'samsio/Container';
import NodeStore from '../stores/nodestore';

class NodeItem extends React.Component {
    render() {
        return <li>{this.props.node.system}</li>
    }
}

class NodeList extends React.Component {
    render() {
        return <ul>{this.props.nodes.map(v => (<NodeItem node={v} />))}</ul>
    }
}

class Application extends React.Component {
    render() {
        return <Container store={NodeStore}><NodeList /></Container>;
    }
}

export default Application;
