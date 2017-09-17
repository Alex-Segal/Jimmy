import React from 'react';
import Container from 'samsio/Container';
import ViewStore from '../stores/view';

class CharacterStatus extends React.Component {
    render() {
        return <div className="character-status">
            {this.props.online ? (<div className="status online">Onine</div>) : (<div className="status offline">Offline</div>)}
            {this.props.character_id ? (<div className="character-portrait">
                <img src={"http://image.eveonline.com/Character/" + this.props.character_id + "_128.jpg"} />
                <div className="character-name">{this.props.character_name}</div>
            </div>) : (<div className="character-error">Waiting</div>)}
        </div>;
    }
}

class ActionBar extends React.Component {
    render() {
        return <div className="action-bar">
            <h2>jimmy</h2>
            <Store store={ViewStore}><CharacterStatus /></Store>
        </div>;
    }
}

export default ActionBar;
