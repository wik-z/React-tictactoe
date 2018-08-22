import React from 'react';

import { connect } from 'react-redux';

import * as connectionActions from '../store/actions/connection/actions';

import ChooseName from './Stages/ChooseName';
import HostIndex from './Stages/HostIndex';
import ClientIndex from './Stages/ClientIndex';
import Game from './Stages/Game';
import Error from './Stages/Error';

import PeerService, { PeerMessage } from '../services/PeerService';

class App extends React.Component {
    peer = null
    connection = null

    state = {
        stage: 'choose-name'
    }

    componentDidMount() {
        this.init();
    }

    init() {
        this.registerPeerEvents();

        const url = new URL(window.location.href);
        const room = url.searchParams.get('room');
    
        if (room) {
            this.props.setUserAsClient();
            this.props.setRoom(room);
            return;
        }
        
        this.props.setUserAsHost();
        PeerService.initHostConnection();
    }

    registerPeerEvents() {
        // Same situation for the host. We use a different event because host is handled in a different way
        PeerService.on(PeerService.events.PEER_CONNECTION, () => {
            this.props.connectionEstabilished();
            PeerService.send({ type: PeerService.messageTypes.HANDSHAKE, payload: this.props.connection.currentUser() });
        });
        
        // when connection between two peers has been opened, mark it in the store
        PeerService.on(PeerService.events.CONNECTION_OPEN, () => {
            this.props.connectionEstabilished();
            PeerService.send({ type: PeerService.messageTypes.HANDSHAKE, payload: this.props.connection.currentUser() });
        });
         
        PeerService.on(PeerService.events.CONNECTION_DATA, (data) => {
            switch (data.type) {
                case PeerService.messageTypes.HANDSHAKE: {
                    this.props.setUserData({ name: data.payload.name }, !this.props.connection.isHost);

                    if (this.props.connection.isHost) {

                    }
                }
            }
        });

        // Once a Host peer ID has been created, set it as the room ID
        PeerService.on(PeerService.events.PEER_OPEN, (id) => {
            if (this.props.connection.isHost) {
                this.props.setRoom(id);
            }
        })

        // If an error has occured, save that to the store
        PeerService.on(PeerService.events.PEER_ERROR, this.props.connectionErrored);

        // TODO: Add connection refused handler
    }

    storeUserName(name) {
        this.setState({
            stage: 'index',
        });

        this.props.setUserData({ name }, this.props.connection.isHost);

        if (!this.props.connection.isHost) {
            PeerService.initClientConnection(this.props.connection.roomID);
        }
    }

    render() {
        return (
            <div className="stage-wrapper">
                <Choose>
                    <When condition={this.props.connection.error}>
                        <Error />
                    </When>
                    <When condition={this.props.connection.isConnected}>
                        <Game connection={this.props.connection} />
                    </When>
                    <When condition={this.state.stage === 'choose-name'}>
                        <ChooseName onSubmit={this.storeUserName.bind(this)} />
                    </When>
                    <When condition={this.state.stage === 'index'}>
                        <Choose>
                            <When condition={this.props.connection.isHost}>
                                <HostIndex room={this.props.connection.roomID} />
                            </When>
                            <Otherwise>
                                <ClientIndex />
                            </Otherwise>
                        </Choose>
                    </When>
                </Choose>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        connection: state.connection,
    }
}

export default connect(mapStateToProps, connectionActions)(App);