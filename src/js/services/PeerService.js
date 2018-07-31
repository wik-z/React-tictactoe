import Peer from 'peerjs';
import store from '../store/store';


class PeerService {
    connection = null;
    peer = null;

    constructor() {
        this.peer = new Peer({ key: 'lwjd5qra8257b9' });

        this.registerPeerEvents();
    }

    registerPeerEvents() {
        this.peer.on('open', (id) => {
            // dispatch a connection open action
        });

        this.peer.on('error', (err) => {
            // Dispatch an error action
        })
    }

    initHostConnection() {
        this.peer.on('connection', (connection) => {
            // allow only one peer to connect
            if (this.connection) {
                return connection.close();
            }

            // TODO: Dispatch a connection set action
            // TODO: Perform a handshake between users
            this.connection = connection;

            this.connection.on('data', (data) => {
                // Data received event
            })
        });
    }

    initClientConnection(room) {
        this.connection = this.peer.connect(room);
        this.connection.on('open', () => {
            // perform a handshake
        })

        this.connection.on('data', (data) => {
            // Data received event
        })

        this.connection.on('close', () => {
            this.connection.close();
            this.connection = null;
        })
    }

    on(event, callback) {
        window.bus.$on(`peer.${event}`, callback);
    }

    emit(event, data) {
        window.bus.$emit(`peer.${event}`, data);
    }
}

export default new PeerService();