import React from 'react';
import ReactART from 'react-art';
import {GetNodeByID} from '../stores/nodestore';
import NodeStore from '../stores/nodestore';
import * as NodeActions from '../actions/nodes';
import Rectangle from '../util/rectangle';
import CLASS_COLOURS from '../util/wh_colours';
const Transform = ReactART.Transform;

const CANVAS_WIDTH = 1800;
const CANVAS_HEIGHT = 600;

class NodeItem extends React.Component {
    constructor(props) {
        super(props);
        this.lastClick = 0;
    }

    render() {
        const fontStyle = {
            fontSize: '14',
            fontFamily: 'Verdana',
        };
        var pos = this.props.node.pos;
        return <ReactART.Group x={pos.x} y={pos.y} h={20} w={100} onMouseDown={this.handleMouseDown.bind(this)} onClick={this.handleClick.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} onMouseMove={this.props.onMouseMove}>
            <Rectangle x={0} y={0} width={200} height={20} fill="#212121" stroke={this.props.node.id === this.props.selectedNode ? "#aff" : "#000"} cursor="pointer"/>
            <ReactART.Text x={5} y={4} alignment="left" font={fontStyle} fill={CLASS_COLOURS[this.props.node.class]} cursor="pointer">{this.props.node.class}</ReactART.Text>
            <ReactART.Text x={30} y={4} alignment="left" font={fontStyle} fill="#fff">{this.props.node.nickname}</ReactART.Text>
        </ReactART.Group>;
    }

    handleMouseDown(e) {
        if (e.button != 0) return;
        var point = this.props.transform.point(this.props.node.pos.x, this.props.node.pos.y);
        NodeStore.updateState({
            activeNode: this.props.node.id,
            clickOffset: {x: e.offsetX - point.x, y: e.offsetY - point.y},
        });
    }

    handleMouseUp(e) {
        if (e.button == 2) {
            NodeStore.updateState({
                contextSystem: this.props.node.id,
                click: {x: e.offsetX, y: e.offsetY},
            });
            return;
        }
        this.props.onMouseUp(e);
    }

    handleClick(e) {
        var now = Date.now();
        if (this.lastClick > (now - 500)) {
            NodeStore.updateState({
                selectedNode: this.props.node.id,
                renamingNode: true,
            });
        } else {
            NodeStore.updateState({
                selectedNode: this.props.node.id,
            });
        }
        this.lastClick = now;
    }
}

const NODE_OFFSET_LEFT = {x: 5, y: 10};
const NODE_OFFSET_TOP = {x: 100, y: 5};
const NODE_OFFSET_RIGHT = {x: 195, y: 10};
const NODE_OFFSET_BOTTOM = {x: 100, y: 15};
const NODE_OFFSETS = [
    { // to the right
        fromPos: NODE_OFFSET_RIGHT,
        toPos: NODE_OFFSET_LEFT,
    },
    { // below
        fromPos: NODE_OFFSET_BOTTOM,
        toPos: NODE_OFFSET_TOP,
    },
    { // to the left
        fromPos: NODE_OFFSET_LEFT,
        toPos: NODE_OFFSET_RIGHT,
    },
    { // above
        fromPos: NODE_OFFSET_TOP,
        toPos: NODE_OFFSET_BOTTOM,
    },
];

class ConnectionItem extends React.Component {
    render() {
        var fromNode = GetNodeByID(this.props.node.nodes[0]);
        var toNode = GetNodeByID(this.props.node.nodes[1]);
        var path = ReactART.Path();
        var direction = Math.atan2(fromNode.pos.y - toNode.pos.y, fromNode.pos.x - toNode.pos.x);
        var offsetInd = Math.floor(((direction + Math.PI) * (2 / Math.PI)) + 0.5);
        if (offsetInd >= 4) offsetInd = 0;
        var offsets = NODE_OFFSETS[offsetInd];
        var fromPos = {x: fromNode.pos.x + offsets.fromPos.x, y: fromNode.pos.y + offsets.fromPos.y};
        var toPos = {x: toNode.pos.x + offsets.toPos.x, y: toNode.pos.y + offsets.toPos.y};
        var newDirection = Math.atan2(fromPos.y - toPos.y, fromPos.x - toPos.x);
        var xOff = Math.sin(-newDirection) * 3;
        var yOff = Math.cos(-newDirection) * 3;
        path.move(fromPos.x - xOff, fromPos.y - yOff);
        path.lineTo(toPos.x - xOff, toPos.y - yOff);
        path.lineTo(toPos.x + xOff, toPos.y + yOff);
        path.lineTo(fromPos.x + xOff, fromPos.y + yOff);
        path.lineTo(fromPos.x - xOff, fromPos.y - yOff);
        path.close();

        var col = "#aaa";
        var str = "#000";
        if (this.props.node.frigate) {
            col = "#1e4496";
        }
        if (this.props.node.eol) {
            str = "#8d1e96";
        }
        return <ReactART.Shape d={path} fill={col} stroke={str} strokeWidth="1" onMouseUp={this.handleMouseUp.bind(this)}/>
    }

    handleMouseUp(e) {
        if (e.button == 2) {
            NodeStore.updateState({
                contextConnection: this.props.node.id,
                click: {x: e.offsetX, y: e.offsetY},
            });
        }
    }
}

class ConnectionGroup extends React.Component {
    render() {
        return <ReactART.Group transform={this.props.transform}>
            {this.props.connections.map(v => <ConnectionItem node={v} key={v.id} transform={this.props.transform}/>)}
        </ReactART.Group>;
    }
}

class NodeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panning: false,
        };
        this.downPos = {x: 0, y: 0};
        this.downSet = false;
    }

    render() {
        return <ReactART.Surface width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
            <Rectangle x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#606060" onMouseMove={this.handleMouseMove.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} onMouseDown={this.handleMouseDown.bind(this)}/>
            <ConnectionGroup connections={this.props.connections} transform={this.props.transform}/>
            <ReactART.Group transform={this.props.transform} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} >
                {this.props.nodes.map((v, i) => (<NodeItem
                    node={v}
                    key={v.id}
                    activeNode={this.props.activeNode}
                    selectedNode={this.props.selectedNode}
                    onMouseMove={this.handleMouseMove.bind(this)}
                    onMouseUp={this.handleMouseUp.bind(this)}
                    transform={this.props.transform}
                    />))}
            </ReactART.Group>
        </ReactART.Surface>;
    }

    handleMouseDown(e) {
        this.setState({
            panning: true,
        });
        this.downPos = this.props.transform.inversePoint(e.offsetX, e.offsetY);
        this.downSet = new Transform(this.props.transform);
    }

    handleMouseMove(e) {
        if (this.state.panning) {
            var transform = new Transform(this.downSet);
            var point = transform.inversePoint(e.offsetX, e.offsetY);
            transform.translate(point.x - this.downPos.x, point.y - this.downPos.y);
            NodeStore.updateState({
                transform: transform,
            });
        } else {
            if (this.props.activeNode) {
                var node = GetNodeByID(this.props.activeNode);
                if (!node) return;
                node.pos = this.props.transform.inversePoint(e.offsetX - this.props.clickOffset.x, e.offsetY - this.props.clickOffset.y);
                NodeStore.updateState({});
            }
        }
    }

    handleMouseUp(e) {
        this.setState({
            panning: false,
        });
        if (this.props.contextConnection || this.props.contextSystem || this.props.selectedNode || this.props.activeNode) { // click away from context menu
            NodeStore.updateState({
                contextConnection: false,
                contextSystem: false,
                selectedNode: false,
                renamingNode: false,
                activeNode: false,
            });
        }
        if (this.props.activeNode) {
            NodeActions.UpdateNodePosition(this.props.nodes[this.props.activeNode].id, this.props.transform.inversePoint(e.offsetX - this.props.clickOffset.x, e.offsetY - this.props.clickOffset.y));
        };
    }
}

export default NodeList;
