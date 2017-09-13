import React from 'react';
import ReactART from 'react-art';
import Container from 'samsio/Container';
import NodeStore from '../stores/nodestore';
import * as NodeActions from '../actions/nodes';
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

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 400;

class NodeItem extends React.Component {
    render() {
        const fontStyle = {
            fontSize: '14',
            fontFamily: 'Verdana',
        };
        var pos = this.props.node.pos;
        if (this.props.nodekey === this.props.activeNode) {
            pos = {x: this.props.track.x - this.props.click.x, y: this.props.track.y - this.props.click.y};
        }
        return <ReactART.Group x={pos.x} y={pos.y} h={20} w={100} onMouseDown={this.handleMouseDown.bind(this)}>
            <Rectangle x={0} y={0} width={100} height={20} fill="#212121" stroke="#000" />
            <ReactART.Text x={5} y={4} alignment="left" font={fontStyle} fill={CLASS_COLOURS[this.props.node.class]}>{this.props.node.class}</ReactART.Text>
            <ReactART.Text x={20} y={4} alignment="left" font={fontStyle} fill="#fff">{this.props.node.system}</ReactART.Text>
        </ReactART.Group>;
    }

    handleMouseDown(e) {
        NodeStore.updateState({
            activeNode: this.props.nodekey,
            click: {x: e.clientX - this.props.node.pos.x, y: e.clientY - this.props.node.pos.y},
        });
    }
}

class NodeList extends React.Component {
    render() {
        return <ReactART.Surface width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
            <ReactART.Group x={0} y={0} h={CANVAS_WIDTH} height={CANVAS_HEIGHT} onMouseMove={this.handleMouseMove.bind(this)} onMouseUp={this.handleMouseUp.bind(this)}>
                <Rectangle x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#606060" />
                {this.props.nodes.map((v, i) => (<NodeItem node={v} key={i} click={this.props.click} track={this.props.track} activeNode={this.props.activeNode} nodekey={i} />))}
            </ReactART.Group>
        </ReactART.Surface>;
    }

    handleMouseMove(e) {
        NodeStore.updateState({
            track: {x: e.clientX, y: e.clientY},
        });
    }

    handleMouseUp(e) {
        NodeActions.UpdateNodePosition(this.props.activeNode, {
            x: e.clientX - this.props.click.x,
            y: e.clientY - this.props.click.y,
        });
    }
}

class Application extends React.Component {
    render() {
        return <Container store={NodeStore}><NodeList /></Container>;
    }
}

export default Application;
