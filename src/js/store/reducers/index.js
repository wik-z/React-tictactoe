import { combineReducers } from 'redux';
import connectionReducer from './connection';
import gameReducer from './game';

const rootReducer = combineReducers({
    game: gameReducer,
    connection: connectionReducer,
});

export default rootReducer; 