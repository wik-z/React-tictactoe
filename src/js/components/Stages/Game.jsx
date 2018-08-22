import React from 'react';
import { connect } from 'react-redux';
import Ionicon from 'react-ionicons';

import * as actions from '../../store/actions/game/actions';
import {GAME_STATUS} from '../../store/actions/game/types';

import Board from './Game/Board';
import PeerService from '../../services/PeerService';


class Game extends React.Component {
    componentWillMount() {
        this.registerPeerEvents();
    }

    registerPeerEvents() {
        PeerService.on(PeerService.events.CONNECTION_DATA, (data) => {
            switch (data.type) {
                case PeerService.messageTypes.GAME_START: {
                    if (!this.props.connection.isHost) {
                        this.startGame();
                    }
                }
            }
        });
    }

    startGame(e = null) {
        // todo: handle game restart
        if (e) e.preventDefault();

        if (this.props.connection.isHost) {
            PeerService.send({
                type: PeerService.messageTypes.GAME_START,
            });
        }

        this.props.startGame();
    }

    getCurrentPlayer() {
        if (this.props.game.playerTurn === 'host') {
            return this.props.connection.hostPlayer;
        }

        return this.props.connection.clientPlayer;
    }

    render() {
        return (
            <div className="stage stage-game">
                <Choose>
                    <When condition={!this.props.connection.isHost && this.props.game.status === GAME_STATUS.READY}>
                        <div className="icon">
                            <Ionicon icon="ios-sync" color="#000000" fontSize="86px" rotate={true} />
                        </div>
                        <h1>Waiting for the game to start...</h1>
                    </When>
                    <When condition={this.props.connection.isHost && this.props.game.status === GAME_STATUS.READY}>
                        <h1>{ this.props.connection.clientPlayer.name } has connected!</h1>
                        <button className="btn" onClick={this.startGame.bind(this)}>Let's kick some ass</button>
                    </When>
                    <Otherwise>
                        <h3>{this.getCurrentPlayer().name}'s turn</h3>
                        <Board board={this.props.game.board} />
                    </Otherwise>
                </Choose>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        game: state.game,
    };
}

export default connect(mapStateToProps, actions)(Game);