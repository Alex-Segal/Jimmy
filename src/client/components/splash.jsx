import React from 'react';
import ViewStore from '../stores/view';

class Splash extends React.Component {
    render() {
        return <div className="splash-screen" onClick={this.closeSplash}>
            <div className="splash-box">
                <h2>Welcome to</h2>
                <h1>VOYAGER</h1>
                {this.props.authfail ? (<p>{this.props.authfail}</p>) : false}
            </div>
        </div>;
    }

    closeSplash() {
        ViewStore.updateState({
            splash: false,
        });
    }
}

export default Splash;
