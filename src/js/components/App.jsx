import React from 'react';
import Peer from 'peerjs';

import HostIndex from './Stages/HostIndex';
import ClientIndex from './Stages/ClientIndex';
import Game from './Stages/Game';
import Error from './Stages/Error';

import PeerService from '../services/PeerService';

export default class App extends React.Component {
    peer = null
    connection = null

    // utilise the PeerService
    state = {
        stage: 'boot',
        isHost: true,
        userID: null,
        roomID: null,
        error: false,
        connected: false,
    }

    componentDidMount() {
        this.init();
    }

    init() {
        const url = new URL(window.location.href);
        const room = url.searchParams.get('room');

        this.setState({
            isHost: room ? false : true,
            roomID: room,
        }, () => {
            this.initPeerConnection();
            
            // TODO: Replace logic with PeerService
            if (this.state.isHost === true) {
                this.setupHostConnection();
                return;
            }

            this.setupClientConnection();
        });
    }

    initPeerConnection() {
        // TODO: Init the peer connection with PeerService
    }

    setupClientConnection() {
        this.setState({
            stage: 'client-index',
        });

       // TODO: Call PeerService
    }

    setupHostConnection() {
        this.setState({
            stage: 'host-index',
        });

        // TODO: Call PeerService
    }

    getRoomUrl() {
        if (!this.isHost) {
            return null;
        }
    }

    render() {
        return (
            <div className="stage-wrapper">
                <Choose>
                    <When condition={this.state.connected}>
                        <Game />
                    </When>
                    <When condition={this.state.stage === 'client-index'}>
                        <ClientIndex />
                    </When>
                    <When condition={this.state.stage === 'host-index'}>
                        <HostIndex room={this.state.roomID} />
                    </When>
                </Choose>
                <If condition={this.state.stage === 'error'}>
                    <Error />
                </If>
            </div>
        );
    }
}