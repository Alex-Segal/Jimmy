import React from 'react';
import Container from 'samsio/Container';
import ViewStore from '../stores/view';
import NodeStore from '../stores/nodestore';

class CharacterStatus extends React.Component {
    render() {
        return <div className="character-status">
            {this.props.online ? (<div className="status online">Online</div>) : (<div className="status offline">Offline</div>)}
            {this.props.character_id ? (<div className="character-portrait"><img src={"http://image.eveonline.com/Character/" + this.props.character_id + "_128.jpg"} /></div>) : (<div className="character-error">Loading...</div>)}
            {this.props.character_name ? (<div className="character-name">{this.props.character_name}</div>) : false}
        </div>;
    }
}

class MapActions extends React.Component {
    render() {
        return <div className="map-actions">
            <i className={"fa fa-magnet map-action" + (this.props.gridsnapping ? " active" : " inactive")} onClick={this.toggleSnapping.bind(this)}/>
        </div>;
    }

    toggleSnapping(e) {
        NodeStore.updateState({
            gridsnapping: !NodeStore.getState().gridsnapping,
        });
    }
}

class ActionBar extends React.Component {
    render() {
        return <div className="action-bar">
            <h2>jimmy</h2>
            <Container store={ViewStore}><CharacterStatus /></Container>
            <Container store={NodeStore}><MapActions /></Container>
        </div>;
    }
}

export default ActionBar;
