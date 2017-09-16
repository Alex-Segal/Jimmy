import React from 'react';
import Container from 'samsio/Container';
import NodeStore from '../stores/nodestore';
import ActionBar from './actions';
import MapCanvas from './map';
import WormholeDetail from './detail';
import RenameBox from './rename';
import ContextMenu from './context';

class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = {width: 600, height: 600};
    }

    componentDidMount() {
        var bound = this.updateDimensions.bind(this);
        this.updateBind = bound;
        window.addEventListener("resize", bound);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateBind);
    }

    updateDimensions() {
        this.setState({}); // hacks hacks hacks
    }

    getElement(input) {
        if (!input) return;
        if (input.clientWidth == this.state.width) return; // ???
        this.setState({width: input.clientWidth, height: input.clientHeight});
    }

    render() {
        return <div className="main-application">
            <ActionBar />
            <div className="main-map-canvas" ref={this.getElement.bind(this)}>
                <Container store={NodeStore} >
                    <MapCanvas width={this.state.width} height={this.state.height} />
                    <RenameBox />
                    <ContextMenu />
                </Container>
            </div>
            <div className="wormhole-detail-box">
                <WormholeDetail />
            </div>
        </div>;
    }
}

export default Application;
