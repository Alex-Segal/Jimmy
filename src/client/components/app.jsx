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

    componentWillMount() {
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

    getElement(input) {
        if (!input) return;
        console.log([input.clientWidth, input.clientHeight]);
        if (input.clientWidth == this.state.width && input.clientHeight == this.state.height) return; // ???
        this.setState({width: input.clientWidth, height: input.clientHeight});
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
        </div>;
    }
}

export default Application;
