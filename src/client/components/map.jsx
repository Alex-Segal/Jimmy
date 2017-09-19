import React from 'react';
import ReactART from 'react-art';
import {GetNodeByID} from '../stores/nodestore';
import NodeStore from '../stores/nodestore';
import * as NodeActions from '../actions/nodes';
import Rectangle from '../util/rectangle';
import CLASS_COLOURS from '../util/wh_colours';
import {UpdatePaths} from '../actions/routes';
const Transform = ReactART.Transform;

const BOX_WIDTH = 200;
const BOX_HEIGHT = 20;

function IsNodeSelected(node, selection) {
    return selection && !node.locked &&
        node.pos.x > Math.min(selection.start.x - BOX_WIDTH, selection.end.x - BOX_WIDTH) &&
        node.pos.x < Math.max(selection.start.x, selection.end.x) &&
        node.pos.y > Math.min(selection.start.y - BOX_HEIGHT, selection.end.y - BOX_HEIGHT) &&
        node.pos.y < Math.max(selection.start.y, selection.end.y);
}

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
        const fontAwesome = {
            fontSize: '14',
            fontFamily: 'FontAwesome',
        }
        var pos = this.props.node.pos;
        var selected = IsNodeSelected(this.props.node, this.props.selection) || (this.props.activeNode ? (this.props.activeNode.indexOf(this.props.node.id) !== -1) : false);
        return <ReactART.Group x={pos.x} y={pos.y} height={BOX_HEIGHT} width={BOX_WIDTH} onMouseDown={this.handleMouseDown.bind(this)} onClick={this.handleClick.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} onMouseMove={this.props.onMouseMove}>
            <Rectangle x={0} y={0} width={BOX_WIDTH} height={BOX_HEIGHT} fill={selected ? "#412121" : "#212121"} stroke={this.props.node.id === this.props.selectedNode ? "#aff" : "#000"} cursor="pointer" radius={4}/>
            <ReactART.Text x={5} y={4} alignment="left" font={fontStyle} fill={CLASS_COLOURS[this.props.node.class]} cursor="pointer">{this.props.node.class}</ReactART.Text>
            <ReactART.Text x={30} y={4} alignment="left" font={fontStyle} fill="#fff">{this.props.node.nickname}</ReactART.Text>
            {this.props.node.locked ? (<ReactART.Text x={195} y={4} font={fontAwesome} fill="#999">&#xf023;</ReactART.Text>) : false}
        </ReactART.Group>;
    }

    handleMouseDown(e) {
        if (e.button != 0) return;
        var activeNode = this.props.activeNode;
        if (!activeNode) activeNode = [this.props.node.id];
        var click = this.props.transform.inversePoint(e.offsetX, e.offsetY);
        NodeStore.updateState({
            activeNodeOffsets: activeNode.map(v => {
                var node = GetNodeByID(v);
                return {x: click.x - node.pos.x, y: click.y - node.pos.y};
            }),
            activeNode: activeNode,
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
            UpdatePaths();
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

class SelectionHighlight extends React.Component {
    render() {
        if (!this.props.selection) return false;
        return <Rectangle
            x={this.props.selection.start.x}
            y={this.props.selection.start.y}
            width={this.props.selection.end.x - this.props.selection.start.x}
            height={this.props.selection.end.y - this.props.selection.start.y}
            fill="#faa"
            opacity={0.3}
            stroke="#fff"
            onMouseMove={this.props.onMouseMove}
            onMouseUp={this.props.onMouseUp}
            />; // TODO: stop putting onMouse on everything, use a window event
    }
}

const CELL_WIDTH = 40;
const CELL_HEIGHT = 40;

class MapGrid extends React.Component {
    render() {
        var pointA = this.props.transform.point(0, 0);
        var pointB = this.props.transform.point(CELL_WIDTH, CELL_HEIGHT);
        var startPoint = this.props.transform.inversePoint(0, 0);
        startPoint.x = Math.floor(startPoint.x / CELL_WIDTH) * CELL_WIDTH;
        startPoint.y = Math.floor(startPoint.y / CELL_HEIGHT) * CELL_HEIGHT;
        startPoint = this.props.transform.point(startPoint.x, startPoint.y);

        var x = startPoint.x;
        var path = ReactART.Path();

        while (x < this.props.width) {
            path.moveTo(x, 0);
            path.lineTo(x, this.props.height);
            x += Math.abs(pointB.x - pointA.x);
        }

        var y = startPoint.y;
        while (y < this.props.height) {
            path.moveTo(0, y);
            path.lineTo(this.props.width, y);
            y += Math.abs(pointB.y - pointA.y);
        }
        return <ReactART.Shape d={path} stroke="#101010" strokeWidth="0.2"/>
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
        this.downTime = 0;
    }

    render() {
        return <ReactART.Surface width={this.props.width} height={this.props.height}>
            <Rectangle x={0} y={0} width={this.props.width} height={this.props.height} fill="#404040" onMouseMove={this.handleMouseMove.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} onMouseDown={this.handleMouseDown.bind(this)}/>
            {this.props.gridsnapping ? (<MapGrid transform={this.props.transform} width={this.props.width} height={this.props.height} />) : false}
            <ConnectionGroup connections={this.props.connections} transform={this.props.transform}/>
            <ReactART.Group transform={this.props.transform}>
                {this.props.nodes.map((v, i) => (<NodeItem
                    node={v}
                    key={v.id}
                    activeNode={this.props.activeNode}
                    selectedNode={this.props.selectedNode}
                    onMouseMove={this.handleMouseMove.bind(this)}
                    onMouseUp={this.handleMouseUp.bind(this)}
                    transform={this.props.transform}
                    selection={this.props.selection}
                    />))}
                <SelectionHighlight selection={this.props.selection} onMouseMove={this.handleMouseMove.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} />
            </ReactART.Group>
        </ReactART.Surface>;
    }

    handleMouseDown(e) {
        this.downTime = Date.now();
        if (e.button == 2 || e.button == 1) {
            this.setState({
                panning: true,
            });
            this.downPos = this.props.transform.inversePoint(e.offsetX, e.offsetY);
            this.downSet = new Transform(this.props.transform);
        }
        if (e.button == 0) {
            var start = this.props.transform.inversePoint(e.offsetX, e.offsetY);
            NodeStore.updateState({
                selection: {
                    start: start,
                    end: start,
                }
            });
        }
    }

    handleMouseMove(e) {
        if (this.props.selection) {
            var end = this.props.transform.inversePoint(e.offsetX, e.offsetY);
            NodeStore.updateState({
                selection: {
                    start: this.props.selection.start,
                    end: end,
                }
            });
        }
        if (this.state.panning) {
            var transform = new Transform(this.downSet);
            var point = transform.inversePoint(e.offsetX, e.offsetY);
            transform.translate(point.x - this.downPos.x, point.y - this.downPos.y);
            NodeStore.updateState({
                transform: transform,
            });
        } else {
            if (this.props.activeNode && this.props.activeNodeOffsets.length > 0) {
                var point = this.props.transform.inversePoint(e.offsetX, e.offsetY);
                this.props.activeNode.forEach((v, i) => {
                    var node = GetNodeByID(v);
                    node.pos = {x: point.x - this.props.activeNodeOffsets[i].x, y: point.y - this.props.activeNodeOffsets[i].y};
                    if (this.props.gridsnapping) {
                        node.pos = {x: Math.round(node.pos.x / CELL_WIDTH) * CELL_WIDTH, y: Math.round(node.pos.y / CELL_HEIGHT) * CELL_HEIGHT};
                    }
                });
                NodeStore.updateState({});
            }
        }
    }

    handleMouseUp(e) {
        if (e.button == 2 || e.button == 1) {
            this.setState({
                panning: false,
            });
        }
        if (e.button == 0) {
            if (this.props.selection) {
                var sel = this.props.nodes.filter(v => IsNodeSelected(v, this.props.selection)).map(v => v.id);
                NodeStore.updateState({
                    selection: false,
                    activeNode: (sel.length > 0) ? sel : false,
                });
                if (sel.length > 0) return;
            }
            if (this.props.activeNode) {
                NodeActions.UpdateNodePosition(this.props.activeNode);
            }
            NodeStore.updateState({
                activeNode: false,
                activeNodeOffsets: [],
                contextConnection: false,
                contextSystem: false,
                selectedNode: false,
                renamingNode: false,
            });
        }
    }
}

export default NodeList;
