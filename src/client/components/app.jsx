import React from 'react';
import Container from 'samsio/Container';
import NodeStore from '../stores/nodestore';
import MapCanvas from './map';
import WormholeDetail from './detail';
import RenameBox from './rename';
import ContextMenu from './context';

class Application extends React.Component {
    render() {
        return <div className="main-application">
            <div className="main-map-canvas">
                <div className="main-map-box">
                    <Container store={NodeStore} >
                        <MapCanvas />
                        <RenameBox />
                        <ContextMenu />
                    </Container>
                </div>
            </div>
            <WormholeDetail />
        </div>;
    }
}

export default Application;
