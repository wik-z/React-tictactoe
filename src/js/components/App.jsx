import React from 'react';
import Peer from 'peerjs';

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
                error: true,
            });
        })
    }

    setupClientConnection() {
        this.connection = this.peer.connect(this.state.roomID);
        this.connection.on('open', () => {
            this.setState({
                connected: true,
            })
        })

        this.connection.on('data', (data) => {
            console.log(data);
        })
    }

    setupHostConnection() {
        this.peer.on('connection', (connection) => {
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
            <div>
                <h1>Welcome TTT</h1>
                <h4>Your Peer id is: {this.state.userID}</h4>
                <h5>{this.state.isHost ? 'You are a host of the game!' : 'Connecting...'}</h5>
                {
                    this.state.connected ? (
                        <button onClick={this.sendTestMessage.bind(this)}>Sup</button>
                    ) : ''
                }
            </div>
        );
    }
}