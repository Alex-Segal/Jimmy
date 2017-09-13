import React from 'react';
import ReactART from 'react-art';
import Container from 'samsio/Container';
import NodeStore from '../stores/nodestore';
import Rectangle from '../util/rectangle';

const CLASS_COLOURS = {
    'H': '#60A060',
    'L': '#b59f13',
    'N': '#b90000',
    'C1': '#0055b9',
    'C2': '#002ab9',
    'C3': '#ffe018',
    'C4': '#ffcb18',
    'C5': '#ff8b18',
    'C6': '#ff4018',
};

class NodeItem extends React.Component {
    render() {
        const fontStyle = {
            fontSize: '14',
            fontFamily: 'Verdana',
        };
        return <ReactART.Group x={this.props.node.x} y={this.props.node.y} h={20} w={100} onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} onMouseMove={this.handleMouseMove.bind(this)}>
            <Rectangle x={0} y={0} width={100} height={20} fill="#212121" stroke="#000" />
            <ReactART.Text x={5} y={4} alignment="left" font={fontStyle} fill={CLASS_COLOURS[this.props.node.class]}>{this.props.node.class}</ReactART.Text>
            <ReactART.Text x={20} y={4} alignment="left" font={fontStyle} fill="#fff">{this.props.node.system}</ReactART.Text>
        </ReactART.Group>;
    }

    handleMouseDown(e) {
        console.log(e);
    }

    handleMouseUp(e) {
        console.log(e);
    }

    handleMouseMove(e) {
        console.log(e);
    }
}

class NodeList extends React.Component {
    render() {
        return <ReactART.Surface width={700} height={400}>
            <Rectangle x={0} y={0} width={700} height={400} fill="#606060" />
            {this.props.nodes.map((v, i) => (<NodeItem node={v} key={i} />))}
        </ReactART.Surface>;
    }
}

class Application extends React.Component {
    render() {
        return <Container store={NodeStore}><NodeList /></Container>;
    }
}

export default Application;
