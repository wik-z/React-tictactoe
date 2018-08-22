import _TYPE, { GAME_STATUS } from '../actions/game/types';

const initialState = {
    board: Array(9).fill(0),
    playerTurn: 'host',
    resolution: null,
    history: [],
    status: GAME_STATUS.READY,
};

export default function game(state = initialState, action) {
    switch(action.type) {
        case _TYPE.GAME_START: {
            return {
                ...state,
                status: GAME_STATUS.IN_PROGRESS,
                // the person who lost the last time, has the first move in the new game
                playerTurn: state.history.length > 0 ? (state.history[state.history.length - 1] === 'host' ? 'client' : 'host' ) : 'host',
            }
        }
    }

    return state;
}