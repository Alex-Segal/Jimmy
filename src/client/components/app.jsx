import React from 'react';
import ReactART from 'react-art';
import Container from 'samsio/Container';
import NodeStore from '../stores/nodestore';

class NodeItem extends React.Component {
    render() {
        const fontStyle = {
            fontSize: '12',
            fontFamily: 'Verdana',
            fontStyle: '#000',
        };
        return <ReactART.Text x={50} y={50} alignment="left" font={fontStyle} fill="#000">test</ReactART.Text>;
    }
}

class NodeList extends React.Component {
    render() {
        return <ReactART.Surface width={700} height={400}>{this.props.nodes.map((v, i) => (<NodeItem node={v} key={i} />))}</ReactART.Surface>;
    }
}

class Application extends React.Component {
    render() {
        return <Container store={NodeStore}><NodeList /></Container>;
    }
}

export default Application;
