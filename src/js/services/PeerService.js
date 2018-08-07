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

    constructor() {
        this.peer = new Peer({ key: 'lwjd5qra8257b9' });

        this.registerPeerEvents();
    }

    registerPeerEvents() {
        this.peer.on('open', (id) => {
            this.emit(this.events.PEER_OPEN, id);
        });

        this.peer.on('error', (err) => {
            this.connection = null;
            this.emit(this.events.PEER_ERROR, err);
            console.error(err);
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
            throw new Error('Connection is not estabilished!');
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