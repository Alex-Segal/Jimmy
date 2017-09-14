import React from 'react';
import MapCanvas from './map';
import WormholeDetail from './detail';
import RenameBox from './rename';

class Application extends React.Component {
    render() {
        return <div className="main-application">
            <div className="main-map-canvas">
                <div className="main-map-box">
                    <MapCanvas />
                    <RenameBox />
                </div>
            </div>
            <WormholeDetail />
        </div>;
    }
}

export default Application;
