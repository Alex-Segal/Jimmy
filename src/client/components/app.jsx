import React from 'react';
import Container from 'samsio/Container';
import ViewStore from '../stores/view';
import NodeStore from '../stores/nodestore';
import ActionBar from './actions';
import MapCanvas from './map';
import WormholeDetail from './detail';
import RenameBox from './rename';
import ContextMenu from './context';
import Splash from './splash';
import Modal from './modal';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {width: 600, height: 600};
    }

    componentDidMount() {
        var bound = this.updateDimensions.bind(this);
        this.updateBind = bound;
        window.addEventListener("resize", bound);
    }

    componentWillMount() {
        var transform = NodeStore.getState().transform;
        transform.translate((window.innerWidth * 0.5) - 100, (window.innerHeight * 0.5) - 60);
        this.updateDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateBind);
    }

    updateDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight - 50,
        });
    }

    render() {
        return <div className="main-application">
            <ActionBar />
            <div className="main-map-canvas">
                <Container store={NodeStore} >
                    <MapCanvas width={this.state.width} height={this.state.height} />
                    <RenameBox />
                    <ContextMenu />
                </Container>
            </div>
            <WormholeDetail />
            <Modal />
        </div>;
    }
}

class AppView extends React.Component {
    render() {
        if (this.props.auth && !this.props.splash) {
            return <Map />;
        } else {
            return <Splash {...this.props} />;
        }
    }
}

class Application extends React.Component {
    render() {
        return <Container store={ViewStore}>
            <AppView />
        </Container>;
    }
}

export default Application;
