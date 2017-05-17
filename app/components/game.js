var React = require('react');
var Reset = require('./Reset');
var Board = require('./board').Board;

//what messages can appear in the game header?
var msges = [
	"go",
	"your turn",
	"kick some ass"
];

var Game = React.createClass({
	getInitialState: function() {
		return {
			game: true,
			move: 0,
			player: 1,
			winner:0,
			reset: false
		}
	},

	//reset a game state
	handleReset: function() {
		this.setState({ game: true, reset:false });
	},

	//handle any change in a board state (except for winning)
	handleGameChange: function( ) {
		var mv = this.state.move + 1;
		var plr = mv%2 + 1;
		this.setState({ player: plr, move: mv});
	},

	//handle winning a game
	handleGameWon: function(win) {
		this.setState({ winner: win, game: false });
	},

	//handle a draw
	handleGameDraw: function() {
		this.setState({ winner: -1, game: false });
	},

	//handle a reset button
	resetGame: function() {
		this.setState({ player: 1, winner: 0, game: false, move: 0, reset: true });
	},

	//fancy fade-in effect, really pathetic way of solving a problem
	componentDidMount: function() {
		setTimeout(function() { document.getElementById('game').setAttribute('class', 'mounted') }, 100);
	},

	render: function() {
		var head; 
		//choose a game header content based on a current game state
		//state.winner is equal -1 if it's a draw, 0 if the game is still on, and 1 or 2 if one of the players (1 or 2) has won the game
		if(this.state.winner > 0) 
			head = this.props.players[this.state.winner-1] + " won the game!"
		else if(this.state.winner == 0) 
			head = this.props.players[this.state.player-1] + ", " + msges[this.state.move%3] + "!";

		else if(this.state.winner == -1)
			head = "DRAW!";


		return (	
				<div id="game">
					<h1>{head}</h1>
					<h4>Moves: {this.state.move}</h4>
					<Board moves={this.state.move} resetCallback={this.handleReset} gameOn={this.state.game} reset={this.state.reset} player={this.state.player} gameDraw={this.handleGameDraw} gameWon={this.handleGameWon} gameChanged={this.handleGameChange} />
					<Reset click={() => this.resetGame()} />
				</div>
				);
	}
});

module.exports = Game;