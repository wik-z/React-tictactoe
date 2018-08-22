import _TYPE from '../actions/connection/types';

const initialState = {
    isConnected: false,
    isHost: false,
    roomID: null,
    hostPlayer: {},
    clientPlayer: {},
    currentUser() { return this.isHost ? this.hostPlayer : this.clientPlayer },
};

export default function connection(state = initialState, action) {
    switch(action.type) {
        case _TYPE.CONNECTION_SET_ROOM: {
            return {
                ...state,
                roomID: action.payload,
            }
        }

        case _TYPE.CONNECTION_ESTABILISHED: {
            return {
                ...state,
                isConnected: true,
            }
        }

        case _TYPE.CONNECTION_SET_USER_AS_HOST: {
            return {
                ...state,
                isHost: true,
            }
        }

        case _TYPE.CONNECTION_SET_USER_AS_CLIENT: {
            return {
                ...state,
                isHost: false,
            }
        }

        case _TYPE.CONNECTION_ERROR: {
            return {
                ...state,
                error: true,
            }
        }

        case _TYPE.CONNECTION_SET_USER_DATA: {
            if (action.payload.isHost) {
                return {
                    ...state,
                    hostPlayer: {
                        ...state.hostPlayer,
                        ...action.payload.data,
                    }
                }
            }

            return {
                ...state,
                clientPlayer: {
                    ...state.clientPlayer,
                    ...action.payload.data,
                }
            }
        }
    }

    return state;
}