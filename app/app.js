var React = require('react');
var ReactDOM = require('react-dom');

//Require Game components
var Game = require('./components/game');
var Login = require('./components/login');

var App = React.createClass({
	getInitialState: function() {
		return {
			play: false,
			players: [
				"One",
				"Two"
			]
		}
	},

	startGame: function(plr1, plr2) {
		//Not just changing state, but a very simple way
		//of creating a fade-out/in effect on the components
		document.getElementById('login').setAttribute('class', 'logged');
		setTimeout(() => this.setState({
			play: true,
			players: [
				plr1,
				plr2
			]
		}), 550);
	},

	render: function() {
		//choose the component depending on the state, if the game is not yet on, show the login page
		var contents = (this.state.play == true ? <Game players={this.state.players} /> : <Login startg={this.startGame} />);
		return (
			<div id="app">
				{contents}
			</div>
		);
	}


});

ReactDOM.render(<App />, document.getElementById('root'))