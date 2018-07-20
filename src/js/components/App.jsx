import React from 'react';
import Peer from 'peerjs';

import HostIndex from './Stages/HostIndex';
import ClientIndex from './Stages/ClientIndex';
import Game from './Stages/Game';
import Error from './Stages/Error';

export default class App extends React.Component {
    peer = null
    connection = null

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

            if (this.state.isHost === true) {
                this.setupHostConnection();
                return;
            }

            this.setupClientConnection();
        });
    }

    initPeerConnection() {
        this.peer = new Peer({ key: 'lwjd5qra8257b9' });

        this.peer.on('open', (id) => {
            this.setState({
                userID: id,
                roomID: id,
            });
        });

        this.peer.on('error', (err) => {
            console.log(err);
            this.setState({
                connected: false,
                error: true,
                stage: 'error',
            });

            setTimeout(() => {
                this.connection = null;
            }, 10)
        })
    }

    setupClientConnection() {
        this.setState({
            stage: 'client-index',
        });

        this.connection = this.peer.connect(this.state.roomID);
        this.connection.on('open', () => {
            this.setState({
                connected: true,
            });
        })

        this.connection.on('data', (data) => {
            console.log(data);
        })

        this.connection.on('close', () => {
            console.log('connection closed.');

            this.setState({
                connected: false,
                error: true,
                stage: 'error',
            });

            setTimeout(() => {
                this.connection = null;
            }, 10)
        })
    }

    setupHostConnection() {
        this.setState({
            stage: 'host-index',
        });

        this.peer.on('connection', (connection) => {
            // allow only one peer to connect
            if (this.connection) {
                return connection.close();
            }

            this.connection = connection;
            this.setState({
                connected: true,
            });

            this.connection.on('data', (data) => {
                console.log(data);
            })
        });
    }

    getRoomUrl() {
        if (!this.isHost) {
            return null;
        }
    }

    sendTestMessage() {
        if (!this.state.connected || !this.connection) {
            return;
        }

        this.connection.send('Test message');
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