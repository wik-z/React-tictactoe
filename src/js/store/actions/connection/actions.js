import _TYPE from './types';

export function setUserAsHost() {
    return {
        type: _TYPE.CONNECTION_SET_USER_AS_HOST,
    };
}

export function setUserAsClient() {
    return {
        type: _TYPE.CONNECTION_SET_USER_AS_CLIENT,
    };
}

export function setRoom(room) {
    return {
        type: _TYPE.CONNECTION_SET_ROOM,
        payload: room,
    };
}

export function connectionEstabilished() {
    return {
        type: _TYPE.CONNECTION_ESTABILISHED,
    };
}

export function connectionErrored() {
    return {
        type: _TYPE.CONNECTION_ERROR,
    };
}

export function setUserData(data, isHost = false) {
    return {
        type: _TYPE.CONNECTION_SET_USER_DATA,
        payload: { isHost, data },
    };
}