import Peer from 'peerjs';
import store from '../store/store';


class PeerService {
    connection = null;
    peer = null;

    events = {
        PEER_OPEN: 'open',
        PEER_ERROR: 'error',
        PEER_CONNECTION: 'connection',
        CONNECTION_OPEN: 'connection.open',
        CONNECTION_CLOSE: 'connection.close',
        CONNECTION_DATA: 'connection.data',
    }

    static messageTypes = {
        HANDSHAKE: 'handshake', // sent by both host and client once connection has been estabilished
        GAME_START: 'game.start', // sent by host to client when game is about to start;
        GAME_PLACED_MARKER: 'game.placed-marker', // sent by both host and client when they place a marker on the grid
        GAME_END: 'game.end' // game end event sent by host; must include the result of the game
    }

    constructor() {
        this.peer = new Peer({ key: 'lwjd5qra8257b9' });

        this.messageTypes = PeerService.messageTypes;
        this.registerPeerEvents();
    }

    registerPeerEvents() {
        this.peer.on('open', (id) => {
            this.emit(this.events.PEER_OPEN, id);
        });

        this.peer.on('error', (err) => {
            this.connection = null;
            this.emit(this.events.PEER_ERROR, err);
            throw new Error(err);
        })
    }

    initHostConnection() {
        this.peer.on('connection', (connection) => {
            // allow only one peer to connect
            if (this.connection) {
                return connection.close();
            }

            this.connection = connection;

            // give a small timeout before sending out a handshake so that the client is ready
            setTimeout(() => {
                this.emit(this.events.PEER_CONNECTION);
            }, 200);

            this.connection.on('data', (data) => {
                this.emit(this.events.CONNECTION_DATA, data);
            })
        });
    }

    initClientConnection(room) {
        this.connection = this.peer.connect(room);
        this.connection.on('open', () => {
            this.emit(this.events.CONNECTION_OPEN);
        })

        this.connection.on('data', (data) => {
            this.emit(this.events.CONNECTION_DATA, data);
        })

        this.connection.on('close', () => {
            this.connection.close();
            this.connection = null;
            this.emit(this.events.CONNECTION_CLOSE, data);
        })
    }

    send(data) {
        if (!this.connection) {
            throw new Error('Connection not estabilished!');
            return;
        }

        this.connection.send(data)
    }

    on(event, callback) {
        window.bus.$on(`peer.${event}`, callback);
    }

    emit(event, data) {
        window.bus.$emit(`peer.${event}`, data);
    }
}


export default new PeerService();