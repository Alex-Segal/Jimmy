import React from 'react';
import Container from 'samsio/Container';
import ViewStore from '../stores/view';
import NodeStore from '../stores/nodestore';
import ReactART from 'react-art';

class CharacterSingleStatus extends React.Component {
    render() {
        return <div className="character-box">
            <div className="character-portrait"><img src={"https://image.eveonline.com/Character/" + this.props.id + "_128.jpg"} /></div>
            <div className="character-name">{this.props.name}</div>
        </div>;
    }
}

class CharacterStatus extends React.Component {
    render() {
        return <div className="character-status">
            {this.props.online ? (<div className="status online">Online</div>) : (<div className="status offline">Offline</div>)}
            <div className="character-list">{this.props.characters ? (this.props.characters.map(v => <CharacterSingleStatus {...v} key={v.character_id} />)) : false}</div>
        </div>;
    }
}

class MapActions extends React.Component {
    render() {
        return <div className="map-actions">
            <i className={"fa fa-magnet map-action" + (this.props.gridsnapping ? " active" : " inactive")} onClick={this.toggleSnapping.bind(this)} />
            <i className="fa fa-search map-action inactive" onClick={this.resetView.bind(this)} />
            <i className={"fa fa-info-circle map-action" + (this.props.detailview ? " active" : " inactive")} onClick={this.toggleDetail.bind(this)} />
        </div>;
    }

    toggleSnapping(e) {
        NodeStore.updateState({
            gridsnapping: !NodeStore.getState().gridsnapping,
        });
    }

    resetView(e) {
        var transform = new ReactART.Transform();
        transform.translate(window.innerWidth * 0.5, window.innerHeight * 0.5);
        NodeStore.updateState({
            transform: transform,
        });
    }

    toggleDetail(e) {
        NodeStore.updateState({
            detailview: !NodeStore.getState().detailview,
        });
    }
}

class ActionBar extends React.Component {
    render() {
        return <div className="action-bar">
            <h2>VOYAGER</h2>
            <Container store={ViewStore}><CharacterStatus /></Container>
            <Container store={NodeStore}><MapActions /></Container>
        </div>;
    }
}

export default ActionBar;
