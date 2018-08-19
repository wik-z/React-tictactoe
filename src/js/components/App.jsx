import React from 'react';

import { connect } from 'react-redux';

import * as connectionActions from '../store/actions/connection/actions';

import HostIndex from './Stages/HostIndex';
import ClientIndex from './Stages/ClientIndex';
import Game from './Stages/Game';
import Error from './Stages/Error';

import PeerService, { PeerMessage } from '../services/PeerService';

class App extends React.Component {
    peer = null
    connection = null

    state = {
        stage: 'index'
    }

    componentDidMount() {
        this.init();
    }

    init() {
        this.registerPeerEvents();

        const url = new URL(window.location.href);
        const room = url.searchParams.get('room');
    
        if (room) {
            PeerService.initClientConnection(room);
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
            PeerService.send({ type: PeerService.messageTypes.HANDSHAKE, payload: 'HostPlayer'});
        });
        
        // when connection between two peers has been opened, mark it in the store
        PeerService.on(PeerService.events.CONNECTION_OPEN, () => {
            this.props.connectionEstabilished();
            PeerService.send({ type: PeerService.messageTypes.HANDSHAKE, payload: 'ClientPlayer'});
        });
         
        // for tests
        PeerService.on(PeerService.events.CONNECTION_DATA, (data) => {
            console.log(data);
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

    render() {
        return (
            <div className="stage-wrapper">
                <Choose>
                    <When condition={this.props.connection.error}>
                        <Error />
                    </When>
                    <When condition={this.props.connection.isConnected}>
                        <Game />
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
        game: state.game,
        connection: state.connection,
    }
}

export default connect(mapStateToProps, connectionActions)(App);