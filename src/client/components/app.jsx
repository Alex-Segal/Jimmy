import React from 'react';
import MapCanvas from './map';
import WormholeDetail from './detail';

class Application extends React.Component {
    render() {
        return <div className="main-application">
            <div className="main-map-canvas">
                <MapCanvas />
            </div>
            <WormholeDetail />
        </div>;
    }
}

export default Application;
